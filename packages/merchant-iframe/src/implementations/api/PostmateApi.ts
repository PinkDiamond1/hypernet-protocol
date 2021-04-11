import { errAsync, okAsync, ResultAsync } from "neverthrow";
import Postmate from "postmate";
import { ChildProxy, IIFrameCallData } from "@hypernetlabs/utils";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { IMerchantConnector } from "@hypernetlabs/merchant-connector";
import { IMerchantIFrameApi } from "@merchant-iframe/interfaces/api";
import { IMerchantService } from "@merchant-iframe/interfaces/business";
import { PushPayment, PullPayment, PublicIdentifier, Balances, AssetBalance } from "@hypernetlabs/objects";
import { BigNumber} from "ethers";

export class PostmateApi extends ChildProxy implements IMerchantIFrameApi {
  protected merchantConnector: IMerchantConnector | undefined;
  constructor(protected merchantService: IMerchantService, protected contextProvider: IContextProvider) {
    super();

    const context = contextProvider.getMerchantContext();

    context.onMerchantConnectorActivated.subscribe({
      next: (merchantConnector) => {
        // We are going to relay the RXJS events
        merchantConnector.onSendFundsRequested.subscribe(() => {
          this.parent?.emit("onSendFundsRequested");
        });

        merchantConnector.onAuthorizeFundsRequested.subscribe(() => {
          this.parent?.emit("onAuthorizeFundsRequested");
        });

        merchantConnector.onDisplayRequested.subscribe(() => {
          this.parent?.emit("onDisplayRequested", context.merchantUrl);
        });

        merchantConnector.onCloseRequested.subscribe(() => {
          this.parent?.emit("onCloseRequested", context.merchantUrl);
        });
      },
    });
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model. The merchant iframe has two halves- the parts that work before the merchant connector has been activated
    // and the parts that work afterward. Postmate only supports a single model, so you have to have all the functions defined up front.
    Postmate.debug = true;
    return new Postmate.Model({
      activateConnector: (data: IIFrameCallData<IActivateConnectorData>) => {
        this.returnForModel(() => {
          console.log("activateConnector!");

          // Convert the balances to an actual balances object
          console.log(data.data);
          const assets = data.data.balances.assets.map((val) => {
            return new AssetBalance(val.assetAddress,
              val.name,
              val.symbol,
              val.decimals,
              BigNumber.from(val.totalAmount),
              BigNumber.from(val.lockedAmount),
              BigNumber.from(val.freeAmount));
          })
          const balances = new Balances(assets);

          console.log(balances);

          return this.merchantService.activateMerchantConnector(data.data.publicIdentifier, balances).map((merchantConnector) => {
            this.merchantConnector = merchantConnector;
          });
        }, data.callId);
      },
      resolveChallenge: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          if (this.merchantConnector == null) {
            return errAsync(new Error("No merchant connector available!"));
          }

          return ResultAsync.fromPromise(this.merchantConnector.resolveChallenge(data.data), (e) => e);
        }, data.callId);
      },
      getAddress: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          if (this.merchantConnector == null) {
            return errAsync(new Error("No merchant connector available!"));
          }
          return ResultAsync.fromPromise(this.merchantConnector.getAddress(), (e) => e);
        }, data.callId);
      },
      getValidatedSignature: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();

          return okAsync(context.validatedMerchantSignature);
        }, data.callId);
      },
      merchantIFrameClosed: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onIFrameClosed();
          return okAsync(undefined);
        }, data.callId);
      },
      merchantIFrameDisplayed: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onIFrameClosed(); return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentSent: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPushPaymentSent(data.data); return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentUpdated: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPushPaymentUpdated(data.data); return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentReceived: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPushPaymentReceived(data.data); return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentSent: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPullPaymentSent(data.data); return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentUpdated: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPullPaymentUpdated(data.data); return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentReceived: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPullPaymentReceived(data.data); return okAsync(undefined);
        }, data.callId);
      },
      notifyPublicIdentifier: (data: IIFrameCallData<PublicIdentifier>) => {
        this.returnForModel(() => {
          return this.merchantService.publicIdentifierReceived(data.data);
        }, data.callId);
      },
      notifyBalancesReceived: (data: IIFrameCallData<Balances>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onBalancesReceived(data.data); return okAsync(undefined);
        }, data.callId);
      }
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void { }
}

interface IActivateConnectorData {
  publicIdentifier: PublicIdentifier;
  balances: any;
}