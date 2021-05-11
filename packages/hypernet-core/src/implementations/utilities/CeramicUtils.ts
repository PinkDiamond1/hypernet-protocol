import {
  CeramicError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { EthereumAddress, Document } from "@hypernetlabs/objects";
import { okAsync, ResultAsync, errAsync, err } from "neverthrow";
import {
  ICeramicUtils,
  IBlockchainProvider,
  IConfigProvider,
  IContextProvider,
} from "@interfaces/utilities";
import { ILogUtils } from "@hypernetlabs/utils";
import {
  ThreeIdConnect,
  EthereumAuthProvider,
  DidProviderProxy,
} from "@3id/connect";
import CeramicClient from "@ceramicnetwork/http-client";
import { DID } from "dids";
//import { Doctype } from "@ceramicnetwork/common/lib/doctype";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { Resolver, DIDResolutionResult, ResolverRegistry } from "did-resolver";

export class CeramicUtils implements ICeramicUtils {
  protected toCeramicError: (e: unknown) => CeramicError = (e) => {
    console.log("toCeramicError e: ", e);
    return new CeramicError(e as Error);
  };
  protected ceramic: CeramicClient = {} as CeramicClient;
  protected threeIdConnect: ThreeIdConnect = {} as ThreeIdConnect;
  protected authProvider: EthereumAuthProvider = {} as EthereumAuthProvider;
  protected threeIdResolver: ResolverRegistry = {} as ResolverRegistry;
  protected didResolver: Resolver = {} as Resolver;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected logUtils: ILogUtils,
  ) {}

  public AuthenticateUser(): ResultAsync<
    void,
    CeramicError | BlockchainUnavailableError
  > {
    return this._setup().andThen(() => {
      return this._checkInitialization().andThen(() => {
        return this.contextProvider
          .getInitializedContext()
          .andThen((context) => {
            return this._getDidProvider().andThen((didProvider) => {
              this.ceramic.setDID(
                new DID({
                  provider: didProvider,
                  resolver: ThreeIdResolver.getResolver(this.ceramic),
                }),
              );

              if (!this.ceramic.did) {
                return errAsync(
                  this.toCeramicError(new Error("did is undefined")),
                );
              }

              context.onDeStorageAuthenticationStarted.next();

              return ResultAsync.fromPromise(
                this.ceramic.did?.authenticate(),
                this.toCeramicError,
              )
                .andThen(() => {
                  context.onDeStorageAuthenticationSucceeded.next();

                  return okAsync(undefined);
                })
                .mapErr((e) => {
                  context.onDeStorageAuthenticationFailed.next();

                  return e as CeramicError;
                });
            });
          });
      });
    });
  }

  /* public writeDocument(document: Document): ResultAsync<Doctype, CeramicError> {
    return this._checkInitialization().andThen(() => {
      return ResultAsync.fromPromise(
        this.ceramic.createDocument(document.type, {
          content: { data: document.content },
          metadata: {
            controllers: document.controllers || [
              this.ceramic?.did?.id as string,
            ],
            family: document.family,
          },
        }),
        this.toCeramicError,
      );
    });
  } */

  /* public readDocument(
    documentFamilyName: string,
  ): ResultAsync<Doctype, CeramicError> {
    return this._getDocumentsByDID().andThen(
      (didResolutionResult: DIDResolutionResult) => {
        console.log("didResolutionResult: ", didResolutionResult);
        // TODO: Ceramic repo is still in maintenance, complete the implementation here once Ceramic version becomes stable
        return okAsync({} as Doctype);
      },
    );
  } */

  /* private _getDocumentsByDID(): ResultAsync<DIDResolutionResult, CeramicError> {
    return ResultAsync.fromPromise(
      this.didResolver.resolve(this.ceramic?.did?.id as string),
      this.toCeramicError,
    );
  } */

  private _setup(): ResultAsync<void, CeramicError> {
    return this.configProvider.getConfig().andThen((config) => {
      return this._getAdresses().andThen((addresses) => {
        this.ceramic = new CeramicClient(config.ceramicNodeUrl);
        this.authProvider = new EthereumAuthProvider(
          window.ethereum,
          addresses[0],
        );
        this.threeIdConnect = new ThreeIdConnect();
        //this.threeIdResolver = ThreeIdResolver.getResolver(this.ceramic);
        //this.didResolver = new Resolver(this.threeIdResolver);
        return okAsync(undefined);
      });
    });
  }

  private _getAdresses(): ResultAsync<
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this.blockchainProvider.getProvider().andThen((provider) => {
      return ResultAsync.fromPromise(provider.listAccounts(), (e) => {
        return e as BlockchainUnavailableError;
      }).map(async (addresses) => {
        return addresses.map((val) => EthereumAddress(val));
      });
    });
  }

  private _getDidProvider(): ResultAsync<DidProviderProxy, CeramicError> {
    return ResultAsync.fromPromise(
      this.threeIdConnect.connect(this.authProvider),
      this.toCeramicError,
    ).andThen(() => {
      const didProvider = this.threeIdConnect?.getDidProvider();
      console.log("didProvider: ", didProvider);

      if (!didProvider) {
        return errAsync(
          this.toCeramicError(new Error("Something went wrong with ceramic!")),
        );
      }
      return okAsync(didProvider);
    });
  }

  private _checkInitialization(): ResultAsync<void, CeramicError> {
    if (
      !Object.keys(this.ceramic).length ||
      !Object.keys(this.authProvider).length ||
      !Object.keys(this.threeIdConnect).length
      //!Object.keys(this.threeIdResolver).length ||
      //!Object.keys(this.didResolver).length
    ) {
      return errAsync(
        this.toCeramicError(
          new Error("Something went wrong while initializing Ceramic!"),
        ),
      );
    } else {
      return okAsync(undefined);
    }
  }
}
