import { IMerchantConnectorRepository } from "@interfaces/data";
import {
  PullPayment,
  PushPayment,
  ProxyError,
  BlockchainUnavailableError,
  TransferResolutionError,
  PaymentId,
  TransferId,
  EthereumAddress,
  Signature,
  MerchantUrl,
  Balances,
  FatalMerchantConnectorError,
  MerchantActivationError,
  MerchantAuthorizationDeniedError,
} from "@hypernetlabs/objects";
import { InitializedHypernetContext } from "@interfaces/objects";
import { LogicalError, MerchantConnectorError, MerchantValidationError, PersistenceError } from "@hypernetlabs/objects";
import { errAsync, okAsync, ResultAsync, Result, ok, err } from "neverthrow";
import { ResultUtils, IAjaxUtils, ILocalStorageUtils, ILogUtils } from "@hypernetlabs/utils";
import {
  IBlockchainProvider,
  IBlockchainUtils,
  IConfigProvider,
  IContextProvider,
  IMerchantConnectorProxy,
  IVectorUtils,
} from "@interfaces/utilities";
import { BigNumber, ethers } from "ethers";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";

interface IAuthorizedMerchantEntry {
  merchantUrl: MerchantUrl;
  authorizationSignature: string;
}

export class MerchantConnectorRepository implements IMerchantConnectorRepository {
  protected authorizedMerchantProxies: Map<MerchantUrl, ResultAsync<IMerchantConnectorProxy, MerchantActivationError | MerchantValidationError | MerchantAuthorizationDeniedError | ProxyError>>;
  protected existingProxies: Map<MerchantUrl, IMerchantConnectorProxy>;
  protected domain: TypedDataDomain;
  protected types: Record<string, TypedDataField[]>;
  protected activateAuthorizedMerchantsResult: ResultAsync<void, never> | undefined;
  protected balances: Balances | undefined;

  constructor(
    protected blockchainProvider: IBlockchainProvider,
    protected ajaxUtils: IAjaxUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected vectorUtils: IVectorUtils,
    protected localStorageUtils: ILocalStorageUtils,
    protected merchantConnectorProxyFactory: IMerchantConnectorProxyFactory,
    protected blockchainUtils: IBlockchainUtils,
    protected logUtils: ILogUtils,
  ) {
    this.authorizedMerchantProxies = new Map();
    this.existingProxies = new Map();
    this.domain = {
      name: "Hypernet Protocol",
      version: "1",
    };
    this.types = {
      AuthorizedMerchant: [
        { name: "authorizedMerchantUrl", type: "string" },
        { name: "merchantValidatedSignature", type: "string" },
      ],
    };
  }

  public getMerchantAddresses(
    merchantUrls: MerchantUrl[],
  ): ResultAsync<Map<MerchantUrl, EthereumAddress>, LogicalError> {
    // TODO: right now, the merchant will publish a URL with their address; eventually, they should be held in a smart contract

    // For merchants that are already authorized, we can just go to their connector for the
    // public key.
    const addressRequests = new Array<
      ResultAsync<{ merchantUrl: MerchantUrl; address: EthereumAddress }, MerchantConnectorError | LogicalError>
    >();
    for (const merchantUrl of merchantUrls) {
      const merchantProxy = this.activatedMerchants.get(merchantUrl);

      if (merchantProxy != null) {
        addressRequests.push(
          merchantProxy.getAddress().map((address) => {
            return { merchantUrl, address };
          }),
        );
      } else {
        // Need to get it from the source
        const url = new URL(merchantUrl.toString());
        url.pathname = "address";
        addressRequests.push(
          this.ajaxUtils.get<EthereumAddress, LogicalError>(url).map((address) => {
            return { merchantUrl, address };
          }),
        );
      }
    }

    return ResultUtils.combine(addressRequests).map((vals) => {
      const returnMap = new Map<MerchantUrl, EthereumAddress>();
      for (const val of vals) {
        returnMap.set(MerchantUrl(val.merchantUrl.toString()), EthereumAddress(val.address));
      }

      return returnMap;
    });
  }

  public addAuthorizedMerchant(
    merchantUrl: MerchantUrl,
    initialBalances: Balances,
  ): ResultAsync<
    void,
    | PersistenceError
    | LogicalError
    | MerchantValidationError
    | ProxyError
    | BlockchainUnavailableError
    | MerchantConnectorError
  > {
    let proxy: IMerchantConnectorProxy;
    let context: InitializedHypernetContext;

    // First, we will create the proxy
    return this.contextProvider
      .getInitializedContext()
      .andThen((myContext) => {
        context = myContext;
        return this.merchantConnectorProxyFactory.factoryProxy(merchantUrl);
      })
      .andThen((myProxy) => {
        proxy = myProxy;
        this.existingProxies.set(merchantUrl, proxy);

        // With the proxy activated, we can get the validated merchant signature
        return ResultUtils.combine([proxy.getValidatedSignature(), this.blockchainProvider.getSigner()]);
      })
      .andThen((vals) => {
        const [merchantSignature, signer] = vals;

        // merchantSignature has been validated by the iframe, so this is already confirmed.
        // Now we need to get an authorization signature
        const value = {
          authorizedMerchantUrl: merchantUrl,
          merchantValidatedSignature: merchantSignature,
        } as Record<string, any>;
        const signerPromise = signer._signTypedData(this.domain, this.types, value);

        return ResultUtils.combine([ResultAsync.fromPromise<string, MerchantValidationError>(
          signerPromise,
          (e) => e as MerchantValidationError,
        ),
        this._getAuthorizedMerchants()]);
      })
      .andThen((vals) => {
        // The connector has been authorized, store it as an authorized connector
        const [authorizationSignature, authorizedMerchants] = vals;

        authorizedMerchants.set(merchantUrl, Signature(authorizationSignature));

        this._setAuthorizedMerchants(authorizedMerchants);

        // Notify the world that the merchant connector exists
        // Notably, API listeners could start
        if (context != null) {
          context.onMerchantConnectorProxyActivated.next(proxy);
        }

        // Activate the merchant connector
        return proxy.activateConnector(context.publicIdentifier, initialBalances);
      })
      .map(() => {
        // Only if the merchant is successfully activated do we stick it in the list.
        this.authorizedMerchantProxies.set(merchantUrl, okAsync(proxy));
      })
      .mapErr((e) => {
        // If we encounter a problem, destroy the proxy so we can start afresh.
        this._destroyProxy(merchantUrl);

        // Notify the world
        if (context != null) {
          context.onAuthorizedMerchantActivationFailed.next(merchantUrl);
        }

        return e as PersistenceError;
      });
  }

  /**
   * Returns a map of merchant URLs with their authorization signatures.
   */
  public getAuthorizedMerchants(): ResultAsync<Map<MerchantUrl, Signature>, never> {
    return this._getAuthorizedMerchants();
  }

  public resolveChallenge(
    merchantUrl: MerchantUrl,
    paymentId: PaymentId,
    transferId: TransferId,
    balances: Balances,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | TransferResolutionError> {
    // const proxy = this.activatedMerchants.get(merchantUrl);
    const proxy = this._getActivatedMerchantProxy(merchantUrl);

    // if merchant is activated, start resolving the transfer
    if (proxy) {
      return this._resolveTransfer(merchantUrl, paymentId, transferId, balances);
    }
    // If merchant is not activated, try to activate it again and after that start resolving.
    return this.retryAuthorizedMerchantActivation(merchantUrl, balances).andThen(() => {
      return this._resolveTransfer(merchantUrl, paymentId, transferId, balances);
    });
  }

  public closeMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError> {
    const proxy = this.activatedMerchants.get(merchantUrl);

    if (proxy == null) {
      return errAsync(new MerchantConnectorError(`No existing merchant connector for ${merchantUrl}`));
    }

    return proxy.closeMerchantIFrame();
  }

  public displayMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError> {
    const proxy = this.activatedMerchants.get(merchantUrl);

    if (proxy == null) {
      return errAsync(new MerchantConnectorError(`No existing merchant connector for ${merchantUrl}`));
    }

    return proxy.displayMerchantIFrame();
  }

  /**
   * This function will attempt to activate all of your authorized merchants. It should only error 
   * in the case that the whole startup process should be aborted- something is fatally fucked up.
   * This means that even otherwise fatal errors such as like the blockchain being unavailable will
   * not stop it; the net effect is that you have no activated merchants. Authorized, yes, activated no.
   * There are lots of things you can do with an inactive merchant connector.
   */
  public activateAuthorizedMerchants(balances: Balances): ResultAsync<void, never> {
    this.balances = balances;
    
    if (this.activateAuthorizedMerchantsResult == null) {
      this.activateAuthorizedMerchantsResult = ResultUtils.combine([
        this.contextProvider.getInitializedContext(),
        this.getAuthorizedMerchants(),
        this.blockchainProvider.getSigner(),
      ]).andThen((vals) => {
        const [context, authorizedMerchants, signer] = vals;
        const activationResults = new Array<
          () => ResultAsync<void, never>
        >();

        for (const [merchantUrl, signature] of authorizedMerchants) {
          activationResults.push(() => {
            return this._activateAuthorizedMerchant(
              balances,
              merchantUrl,
              signature,
              context,
              signer,
            )
              .map((_proxy) => {
                return;
              })
              .orElse((e) => {
                // This function will eat all errors, so that startup
                // will not be denied. 
                this.logUtils.error(`Could not activate authorized merchant ${merchantUrl}`);
                this.logUtils.error(e);
                return okAsync(undefined);
              });
          });
        }

        // There is a reason for this
        // Postmate has issues creating multiple proxies in parallel- the handshake process will break.
        // I would like to swap out or fix Postmate- there are some forks that would be good- but the easiest
        // fix is this.
        return ResultUtils.executeSerially(activationResults)
      })
        .map(() => { })
        .orElse((e) => {
          this.logUtils.error("Could not get prerequisites for activateAuthorizedMerchants");
          this.logUtils.error(e);
          return okAsync(undefined);
        });
    }
    return this.activateAuthorizedMerchantsResult;
  }

  public notifyPushPaymentSent(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this._getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPushPaymentSent(payment);
    });
  }

  public notifyPushPaymentUpdated(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this._getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPushPaymentUpdated(payment);
    });
  }

  public notifyPushPaymentReceived(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this._getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPushPaymentReceived(payment);
    });
  }

  public notifyPullPaymentSent(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this._getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPullPaymentSent(payment);
    });
  }

  public notifyPullPaymentUpdated(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this._getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPullPaymentUpdated(payment);
    });
  }

  public notifyPullPaymentReceived(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this._getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPullPaymentReceived(payment);
    });
  }

  public notifyBalancesReceived(balances: Balances): ResultAsync<void, MerchantConnectorError> {
    const results = new Array<ResultAsync<void, MerchantConnectorError>>();

    for (const [, merchantConnector] of this.activatedMerchants) {
      results.push(merchantConnector.notifyBalancesReceived(balances));
    }

    return ResultUtils.combine(results).map(() => { });
  }

  public deauthorizeMerchant(merchantUrl: MerchantUrl): ResultAsync<void, never> {
    return this._getAuthorizedMerchants()
      .map((authorizedMerchants) => {
        authorizedMerchants.delete(merchantUrl);
        this._setAuthorizedMerchants(authorizedMerchants);

        // Remove the proxy
        this._destroyProxy(merchantUrl);
      });
  }

  public getAuthorizedMerchantConnectorStatus(): ResultAsync<Map<MerchantUrl, boolean>, never> {
    const retMap = new Map<MerchantUrl, boolean>();
    if (this.activateAuthorizedMerchantsResult == null) {
      throw new Error("You must call activateAuthorizedMerchants first!");
    }

    return ResultUtils.combine([this._getAuthorizedMerchants(), 
      this.activateAuthorizedMerchantsResult])
    .andThen((vals) => {
      const [authorizedMerchants] = vals;
      // Go through the results for the merchant
      const proxyResults = new Array<ResultAsync<void, never>>();
      for (const [merchantUrl, _signature] of authorizedMerchants) {
        const proxyResult = this.authorizedMerchantProxies.get(merchantUrl);

        if (proxyResult == null) {
          throw new Error("Something deeply screwed up!");
        }

        proxyResults.push(proxyResult.map(() => {
          retMap.set(merchantUrl, true);
        })
        .orElse(() => {
          retMap.set(merchantUrl, false);
          return okAsync<void, never>(undefined);
        }));
      }

      return ResultUtils.combine(proxyResults);
    })
    .map(() => {
      return retMap;
    });
  }

  protected _getActivatedMerchantProxy(merchantUrl: MerchantUrl): 
  ResultAsync<IMerchantConnectorProxy, MerchantAuthorizationDeniedError> {
    // The goal of this method is to return an activated merchant proxy,
    // and not resolve unless all hope is lost.

     // Wait until activateAuthorizedMerchants is done doing its thing
     if (this.activateAuthorizedMerchantsResult == null) {
      throw new Error("You need to call activateAuthorizedMerchants first!");
    }

    let cachedAuthorizationSignature: Signature | undefined;

    // Check that the merchantUrl is authorized
    return ResultUtils.combine([this._getAuthorizedMerchants(),
      this.activateAuthorizedMerchantsResult])
      .andThen((vals) => {
        const [authorizedMerchants] = vals;
        // If the merchant is not authorized, that's a fatal error.
        // Now, you may ask yourself, what about addAuthorizedMerchant?
        // Well, you can't call this method until that one is complete.
        // If the merchant was already authorized, you can call this
        // method and get the in-progress activation.
        const authorizationSignature = authorizedMerchants.get(merchantUrl);
        if (authorizationSignature == null) {
          throw new Error(`Merchant ${merchantUrl} is unauthorized!`);
        }

        // Store the signature in case we need to retry anything.
        cachedAuthorizationSignature = authorizationSignature;

        const proxyResult = this.authorizedMerchantProxies.get(merchantUrl);
        if (proxyResult == null) {
          throw new Error(`There is not result for merchant ${merchantUrl}, even though it is authorized. Something strange going on.`);
        }

        return proxyResult;
      })
      .map((proxy) => {
        // The proxy was activated without an error
        return proxy;
      })
      .orElse((e) => {
        

        // There is something wrong
        if (e instanceof MerchantAuthorizationDeniedError) {
          // Not a lot we can do about that.
          return errAsync(e);
        }

        if (e instanceof ProxyError) {
          // We could not setup the proxy.
          // This is retryable
          return ResultUtils.backoffAndRetry(() => {
            // Clean out
            this.authorizedMerchantProxies.delete(merchantUrl);
            this._destroyProxy(merchantUrl);

            this.authorizedMerchantProxies.set(merchantUrl, 
              ResultUtils.combine([this.contextProvider.getInitializedContext(),
              this.blockchainProvider.getSigner()])
              .andThen((vals) => {
                const [context, signer] = vals;

                if (this.balances == null || cachedAuthorizationSignature == null) {
                  throw new Error("No cached balances")
                }

                return this._activateAuthorizedMerchant(this.balances,
                  merchantUrl, cachedAuthorizationSignature,
                  context, 
                  signer)
              }));      
          }, 
          [ProxyError, MerchantValidationError, MerchantActivationError],
          );
        }

        // Backoff
        return errAsync(e);
      })
  }

  protected _resolveTransfer(
    merchantUrl: MerchantUrl,
    paymentId: PaymentId,
    transferId: TransferId,
    balances: Balances,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | TransferResolutionError> {
    const proxy = this.activatedMerchants.get(merchantUrl);

    if (proxy == null) {
      return errAsync(new MerchantValidationError(`No existing merchant connector for ${merchantUrl}`));
    }
    return proxy
      .resolveChallenge(paymentId)
      .andThen((result) => {
        const { mediatorSignature, amount } = result;

        return this.vectorUtils.resolveInsuranceTransfer(
          transferId,
          paymentId,
          Signature(mediatorSignature),
          BigNumber.from(amount),
        );
      })
      .map(() => { });
  }

  /**
   * This function does all the work of trying to activate a merchant connector. It can be called multiple times.
   * @param accountAddress 
   * @param balances 
   * @param merchantUrl 
   * @param authorizationSignature 
   * @param context 
   * @param signer 
   * @returns 
   */
  protected _activateAuthorizedMerchant(
    balances: Balances,
    merchantUrl: MerchantUrl,
    authorizationSignature: Signature,
    context: InitializedHypernetContext,
    signer: ethers.providers.JsonRpcSigner,
  ): ResultAsync<IMerchantConnectorProxy, MerchantActivationError | MerchantValidationError | MerchantAuthorizationDeniedError | ProxyError> {
    // Do some initial cleanup, so that this can be called repeatedly.
    const existingProxyResult = this.authorizedMerchantProxies.get(merchantUrl);

    if (existingProxyResult != null) {
      return existingProxyResult;
    }

    let proxy: IMerchantConnectorProxy;

    const proxyResult = this.merchantConnectorProxyFactory
    .factoryProxy(merchantUrl)
    .andThen((myProxy) => {
      proxy = myProxy;
      this.existingProxies.set(merchantUrl, proxy);

      // We need to get the validated signature, so we can see if it was authorized
      return this._validateConnector(merchantUrl,
        proxy,
        authorizationSignature,
        context,
        signer);
    })
    .andThen(() => {
      return this._activateConnector(merchantUrl, context, proxy, balances);
    })
    .mapErr((e) => {
      // Notify the world
      context.onAuthorizedMerchantActivationFailed.next(proxy.merchantUrl);

      if (e instanceof ProxyError) {
        this._destroyProxy(merchantUrl);
      }
      else if (e instanceof FatalMerchantConnectorError) {
        this._destroyProxy(merchantUrl);
      }

      return e;
    });

    this.authorizedMerchantProxies.set(merchantUrl, proxyResult);

    return proxyResult;
  }

  protected _validateConnector(merchantUrl: MerchantUrl,
    proxy: IMerchantConnectorProxy,
    authorizationSignature: Signature,
    context: InitializedHypernetContext,
    signer: ethers.providers.JsonRpcSigner): ResultAsync<void, MerchantAuthorizationDeniedError | MerchantValidationError | ProxyError> {
    return proxy.getValidatedSignature()
      .andThen((validatedSignature) => {
        const value = {
          authorizedMerchantUrl: merchantUrl,
          merchantValidatedSignature: validatedSignature,
        } as Record<string, any>;

        const validationAddress = this.blockchainUtils.verifyTypedData(this.domain,
          this.types,
          value,
          authorizationSignature);

        if (validationAddress !== context.account) {
          // Notify the user that one of their authorized merchants has changed their code
          context.onAuthorizedMerchantUpdated.next(merchantUrl);

          // Get a new signature
          // validatedSignature means the code is signed by the provider, so we just need
          // to sign this new version.
          const signerPromise = signer._signTypedData(this.domain, this.types, value);

          // Get a new signature from the user
          const signerResult = ResultAsync.fromPromise(signerPromise,
            (e) => e as Error).orElse((e) => {
              // We only end up here if the user has denied signing
              // to authorize the new connector. 
              // We need to de-authorize this merchant
              return this.deauthorizeMerchant(merchantUrl)
                .andThen(() => {
                  // And then propagate the error
                  this.logUtils.error(e);
                  return errAsync(new MerchantAuthorizationDeniedError(e.message));
                });
            });

          return ResultUtils.combine([signerResult,
            this._getAuthorizedMerchants()])
            .map((vals) => {
              const [newAuthorizationSignature, authorizedMerchants] = vals;

              authorizedMerchants.set(
                merchantUrl,
                Signature(newAuthorizationSignature),
              );

              this._setAuthorizedMerchants(authorizedMerchants);
            });
        }

        return okAsync<void, MerchantAuthorizationDeniedError>(undefined);
      });
  }

  protected _activateConnector(merchantUrl: MerchantUrl,
    context: InitializedHypernetContext,
    proxy: IMerchantConnectorProxy,
    balances: Balances): ResultAsync<IMerchantConnectorProxy, MerchantActivationError | ProxyError> {
    return proxy.activateConnector(context.publicIdentifier, balances)
      .map(() => {
        return proxy;
      });
  }

  protected _destroyProxy(merchantUrl: MerchantUrl): void {
    const proxy = this.existingProxies.get(merchantUrl);
    if (proxy != null) {
      proxy.destroy();
      this.existingProxies.delete(merchantUrl);
    }
  }

  protected _setAuthorizedMerchants(authorizedMerchantMap: Map<MerchantUrl, Signature>) {
    const authorizedMerchantEntries = new Array<IAuthorizedMerchantEntry>();
    for (const keyval of authorizedMerchantMap) {
      authorizedMerchantEntries.push({
        merchantUrl: MerchantUrl(keyval[0]),
        authorizationSignature: Signature(keyval[1]),
      });
    }
    this.localStorageUtils.setItem("AuthorizedMerchants", JSON.stringify(authorizedMerchantEntries));
  }

  protected _getAuthorizedMerchants(): ResultAsync<Map<MerchantUrl, Signature>, never> {
    let authorizedMerchantStr = this.localStorageUtils.getItem("AuthorizedMerchants");

    if (authorizedMerchantStr == null) {
      authorizedMerchantStr = "[]";
    }
    const authorizedMerchantEntries = JSON.parse(authorizedMerchantStr) as IAuthorizedMerchantEntry[];

    const authorizedMerchants = new Map<MerchantUrl, Signature>();
    for (const authorizedMerchantEntry of authorizedMerchantEntries) {
      authorizedMerchants.set(
        MerchantUrl(authorizedMerchantEntry.merchantUrl),
        Signature(authorizedMerchantEntry.authorizationSignature)
      );
    }
    return okAsync(authorizedMerchants);
  }
}
