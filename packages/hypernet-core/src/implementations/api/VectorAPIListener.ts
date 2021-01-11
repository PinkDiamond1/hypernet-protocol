import {
  ConditionalTransferCreatedPayload,
  ConditionalTransferResolvedPayload,
  EngineEvents,
} from "@connext/vector-types";
import { IVectorListener } from "@interfaces/api";
import { IPaymentService } from "@interfaces/business";
import { IHypernetTransferMetadata, ResultAsync } from "@interfaces/objects";
import { LogicalError } from "@interfaces/objects/errors";
import { ETransferType } from "@interfaces/types";
import { IBrowserNodeProvider, IContextProvider, ILogUtils, IPaymentUtils, IVectorUtils } from "@interfaces/utilities";
import { errAsync, okAsync } from "neverthrow";

/**
 *
 */
export class VectorAPIListener implements IVectorListener {
  constructor(
    protected browserNodeProvider: IBrowserNodeProvider,
    protected paymentService: IPaymentService,
    protected vectorUtils: IVectorUtils,
    protected contextProvider: IContextProvider,
    protected paymentUtils: IPaymentUtils,
    protected logUtils: ILogUtils,
  ) {}

  /**
   *
   */
  public setup(): ResultAsync<void, LogicalError> {
    return this.browserNodeProvider.getBrowserNode()
    .map((browserNode) => {
      // When the browser node notifies us that a conditional transfer has been *resolved,
      // (via Vector), this handles it. We call down into the appropriate method on the
      // PaymentService to handle it.
      browserNode.on(EngineEvents.CONDITIONAL_TRANSFER_RESOLVED, (payload: ConditionalTransferResolvedPayload) => {
        // Filter out any transfer not containing a transfer with a UUID in the transferState (insurance & parameterized transfer types)
        // or a UUID as part of transferState.message (message transfer type)

        this.paymentUtils.getTransferType(payload.transfer, browserNode).andThen((transferType) => {
          let paymentId: string;
          const transfer = payload.transfer;

          if (transferType === ETransferType.Offer) {
            // @todo also add in PullRecord type)
            const metadata: IHypernetTransferMetadata = JSON.parse(transfer.transferState.message);
            paymentId = metadata.paymentId;
          } else if (transferType === ETransferType.Insurance || transferType === ETransferType.Parameterized) {
            paymentId = transfer.transferState.UUID;
          } else {
            this.logUtils.log(`Transfer type was not recognized, doing nothing. TransferType: '${transferType}'`);
            return okAsync(null);
          }

          return this.paymentUtils.isHypernetDomain(paymentId).andThen((isHypernetDomain) => {
            if (!isHypernetDomain) {
              this.logUtils.log(
                `Ignoring transfer that is not in the Hypernet Domain: transferID of ${transfer.transferId}, initiator: ${transfer.initiator}`,
              );
              return okAsync(null);
            }

            if (transferType === ETransferType.Offer) {
              // if the transfer is an offer transfer, we need to notify the payment service
              // than an offer has been resolved.
              // @todo create methods in payment service
              return errAsync(new LogicalError("Method not yet implemented!"));
            } else if (transferType === ETransferType.Insurance) {
              // if the transfer is an insurance transfer, we need to notify the payment service
              // that stake has been resolved.
              // @todo create methods in payment service
              return errAsync(new LogicalError("Method not yet implemented!"));
            } else if (transferType === ETransferType.Parameterized) {
              // if the transfer is the parameterized transfer, we need to notify the payment service
              // that the parameterized payment has been resolved.
              return this.paymentService.paymentCompleted(paymentId);
            } else if (transferType === ETransferType.PullRecord) {
              // @todo create methods in payment service
              return errAsync(new LogicalError("Method not yet implemented!"));
            } else {
              return errAsync(new LogicalError("Unrecognized transfer type!"));
            }
          });
        });
      });

      // When the browser node notifies us that a conditional transfer has been created
      // (via Vector), this handles it. We call down into the appropriate method on the
      // PaymentService to handle it.
      browserNode.on(EngineEvents.CONDITIONAL_TRANSFER_CREATED, (payload: ConditionalTransferCreatedPayload) => {
        // Filter out any transfer not containing a transfer with a UUID in the transferState (insurance & parameterized transfer types)
        // or a UUID as part of transferState.message (message transfer type)

        this.paymentUtils.getTransferType(payload.transfer, browserNode).andThen((transferType) => {
          let paymentId: string;
          const transfer = payload.transfer;

          if (transferType === ETransferType.Offer) {
            // @todo also add in PullRecord type)
            const metadata: IHypernetTransferMetadata = JSON.parse(transfer.transferState.message);
            paymentId = metadata.paymentId;
          } else if (transferType === ETransferType.Insurance || transferType === ETransferType.Parameterized) {
            paymentId = transfer.transferState.UUID;
          } else {
            this.logUtils.log(`Transfer type was not recognized, doing nothing. TransferType: '${transferType}'`);
            return okAsync(null);
          }

          return this.paymentUtils.isHypernetDomain(paymentId).andThen((isHypernetDomain) => {
            if (!isHypernetDomain) {
              this.logUtils.log(
                `Ignoring transfer that is not in the Hypernet Domain: transferID of ${transfer.transferId}, initiator: ${transfer.initiator}`,
              );
              return okAsync(null);
            }

            // TODO: We should be advancing the state here
            return okAsync(null);
          });
        });

        // Convert a Vector event into an external event for publishing
        /*return new Observable(subscriber => {
                  .then((browserNode) => {
                      browserNode.on(EngineEvents.SETUP, (payload: SetupPayload) => {
                          subscriber.next(payload);
                      });
                  });
              });*/
      });
    });
  }
}
