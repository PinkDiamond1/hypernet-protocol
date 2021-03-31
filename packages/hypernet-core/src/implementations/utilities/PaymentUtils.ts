import { BigNumber } from "ethers";
import {
  EthereumAddress,
  HexString,
  IHypernetOfferDetails,
  IMessageTransferData,
  Payment,
  PaymentInternalDetails,
  PublicIdentifier,
  PullAmount,
  PullPayment,
  PushPayment,
  SortedTransfers,
  IFullTransferState,
  IHypernetPullPaymentDetails,
  IRegisteredTransfer,
} from "@hypernetlabs/objects";
import {
  InvalidParametersError,
  InvalidPaymentError,
  InvalidPaymentIdError,
  LogicalError,
  VectorError,
} from "@hypernetlabs/objects";
import {
  EPaymentState,
  EPaymentType,
  ETransferState,
  ETransferType,
  InsuranceState,
  MessageState,
  ParameterizedState,
  EMessageTransferType,
} from "@hypernetlabs/objects";
import {
  IBrowserNodeProvider,
  IConfigProvider,
  ILogUtils,
  IPaymentIdUtils,
  IPaymentUtils,
  ITimeUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "@hypernetlabs/utils";
import { v4 as uuidv4 } from "uuid";

/**
 * A class for creating Hypernet-Payment objects from Vector transfers, verifying information
 * about payment Ids, sorting transfers, and other related stuff.
 */
export class PaymentUtils implements IPaymentUtils {
  /**
   * Return an instance of PaymentUtils.
   */
  constructor(
    protected configProvider: IConfigProvider,
    protected logUtils: ILogUtils,
    protected paymentIdUtils: IPaymentIdUtils,
    protected vectorUtils: IVectorUtils,
    protected browserNodeProvider: IBrowserNodeProvider,
    protected timeUtils: ITimeUtils,
  ) {}

  /**
   * Verifies that the paymentId provided has domain matching Hypernet's domain name.
   * @param paymentId the payment ID to check
   */
  public isHypernetDomain(paymentId: HexString): ResultAsync<boolean, InvalidPaymentIdError> {
    return this.configProvider.getConfig().andThen((config) => {
      const domainRes = this.paymentIdUtils.getDomain(paymentId);

      if (domainRes.isErr()) {
        return errAsync(domainRes.error);
      }
      return okAsync(domainRes.value === config.hypernetProtocolDomain);
    });
  }

  /**
   * Creates a 32 byte payment ID of format:
   * <domain-10-bytes><payment-type-6-bytes><UUID-16-bytes>
   * @param paymentType the payment type for the id - PUSH or PULL
   */
  public createPaymentId(paymentType: EPaymentType): ResultAsync<string, InvalidParametersError> {
    return this.configProvider.getConfig().andThen((config) => {
      return this.paymentIdUtils.makePaymentId(config.hypernetProtocolDomain, paymentType, uuidv4());
    });
  }

  /**
   * Given a SortedTransfers object and associated data about the payment, return a PushPayment object.
   * @param paymentId the paymentId for the provided SortedTransfers
   * @param to the destination public id for the payment
   * @param from the sender public id for the payment
   * @param state the current payment state
   * @param sortedTransfers the set of SortedTransfers for this payment
   * @param metadata the IHypernetOfferDetails for this payment
   */
  public transfersToPushPayment(
    paymentId: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
  ): ResultAsync<PushPayment, Error> {
    /**
     * Push payments consist of 3 transfers:
     * MessageTransfer - 0 value, represents an offer
     * InsuranceTransfer - service operator puts up to guarantee the sender's funds
     * ParameterizedPayment - the payment to the service operator
     */

    if (sortedTransfers.pullRecordTransfers.length > 0) {
      throw new Error("Push payment has pull transfers!");
    }

    const amountStaked =
      sortedTransfers.insuranceTransfer != null ? sortedTransfers.insuranceTransfer.transferState.collateral : 0;

    const paymentAmount = sortedTransfers.offerDetails.paymentAmount;

    const amountTransferred =
      sortedTransfers.parameterizedTransfer != null
        ? sortedTransfers.offerDetails.paymentAmount // @todo fix later? sortedTransfers.parameterizedTransfer.transferState.rate.deltaAmount
        : sortedTransfers.offerDetails.paymentAmount;

    const paymentToken =
      sortedTransfers.parameterizedTransfer != null
        ? sortedTransfers.parameterizedTransfer.assetId
        : sortedTransfers.offerDetails.paymentToken;

    const details = new PaymentInternalDetails(
      sortedTransfers.offerTransfer.transferId,
      sortedTransfers.insuranceTransfer?.transferId,
      sortedTransfers.parameterizedTransfer?.transferId,
      sortedTransfers.pullRecordTransfers.map((val) => {
        return val.transferId;
      }),
    );

    return okAsync(
      new PushPayment(
        paymentId,
        to,
        from,
        state,
        paymentToken,
        BigNumber.from(sortedTransfers.offerDetails.requiredStake),
        BigNumber.from(amountStaked),
        sortedTransfers.offerDetails.expirationDate,
        sortedTransfers.offerDetails.creationDate,
        this.timeUtils.getUnixNow(),
        BigNumber.from(0),
        sortedTransfers.offerDetails.merchantUrl,
        details,
        BigNumber.from(paymentAmount),
        BigNumber.from(amountTransferred),
      ),
    );
  }

  /**
   * Given a SortedTransfers object and associated data about the payment, return a PullPayment object.
   * @param paymentId the paymentId for the provided SortedTransfers
   * @param to the destination public id for the payment
   * @param from the sender public id for the payment
   * @param state the current payment state
   * @param sortedTransfers the set of SortedTransfers for this payment
   * @param metadata the IHypernetOfferDetails for this payment
   */
  public transfersToPullPayment(
    paymentId: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
  ): ResultAsync<PullPayment, LogicalError> {
    /**
     * Pull payments consist of 3+ transfers, a null transfer for 0 value that represents the
     * offer, an insurance payment, and a parameterized payment.
     */

    const amountStaked =
      sortedTransfers.insuranceTransfer != null ? sortedTransfers.insuranceTransfer.balance.amount[0] : 0;

    // Get deltaAmount & deltaTime from the parameterized payment
    if (sortedTransfers.offerDetails.rate == null) {
      return errAsync(new LogicalError("These transfers are not for a pull payment."));
    }

    const deltaAmount = BigNumber.from(sortedTransfers.offerDetails.rate.deltaAmount);
    const deltaTime = sortedTransfers.offerDetails.rate.deltaTime;
    let vestedAmount: BigNumber;

    if (sortedTransfers.parameterizedTransfer == null) {
      // No paramterized transfer, no vested amount!
      vestedAmount = BigNumber.from(0);
    } else {
      // Calculate vestedAmount
      const now = this.timeUtils.getUnixNow();
      const timePassed = now - Number(sortedTransfers.parameterizedTransfer.transferState.start);
      vestedAmount = deltaAmount.div(deltaTime).mul(timePassed);
    }

    // Convert the PullRecords to PullAmounts
    const pullAmounts = new Array<PullAmount>();

    for (const pullRecord of sortedTransfers.pullRecordTransfers) {
      let message = JSON.parse(pullRecord.transferState.message) as IHypernetPullPaymentDetails;
      pullAmounts.push(
        new PullAmount(
          BigNumber.from(message.pullPaymentAmount),
          this.vectorUtils.getTimestampFromTransfer(pullRecord),
        ),
      );
    }

    const paymentToken =
      sortedTransfers.parameterizedTransfer != null
        ? sortedTransfers.parameterizedTransfer.assetId
        : sortedTransfers.offerDetails.paymentToken;

    const details = new PaymentInternalDetails(
      sortedTransfers.offerTransfer.transferId,
      sortedTransfers.insuranceTransfer?.transferId,
      sortedTransfers.parameterizedTransfer?.transferId,
      sortedTransfers.pullRecordTransfers.map((val) => {
        return val.transferId;
      }),
    );

    return okAsync(
      new PullPayment(
        paymentId,
        to,
        from,
        state,
        paymentToken,
        BigNumber.from(sortedTransfers.offerDetails.requiredStake),
        BigNumber.from(amountStaked),
        this.timeUtils.getUnixNow() + 60 * 60, // 1 hour
        sortedTransfers.offerDetails.creationDate,
        this.timeUtils.getUnixNow(),
        BigNumber.from(0),
        sortedTransfers.offerDetails.merchantUrl,
        details,
        BigNumber.from(sortedTransfers.offerDetails.paymentAmount),
        BigNumber.from(0),
        vestedAmount,
        deltaTime,
        deltaAmount,
        pullAmounts,
      ),
    );
  }

  /**
   * Given a set of Vector transfers that we /know/ are for one specific payment,
   * return the associated payment object.
   * @param paymentId the payment associated with the provided transfers
   * @param transfers the transfers as IFullTransferState
   * @param config instance of HypernetConfig
   * @param browserNode instance of IBrowserNode
   */
  public transfersToPayment(
    paymentId: string,
    transfers: IFullTransferState[],
  ): ResultAsync<Payment, InvalidPaymentError | InvalidParametersError> {
    let paymentType: EPaymentType;
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        // const signerAddress = getSignerAddressFromPublicIdentifier(context.publicIdentifier);
        const domainRes = this.paymentIdUtils.getDomain(paymentId);
        const paymentTypeRes = this.paymentIdUtils.getType(paymentId);
        const idRes = this.paymentIdUtils.getUUID(paymentId);

        if (domainRes.isErr()) {
          return errAsync(domainRes.error);
        }

        // TODO: This should probably be encapsulated down lower; getDomain() is probably unnecessary and and invalid domain should just result in an InvalidPaymentIdError from getType and getUUID.
        if (domainRes.value !== config.hypernetProtocolDomain) {
          return errAsync(new InvalidParametersError(`Invalid payment domain: '${domainRes.value}'`));
        }

        if (paymentTypeRes.isErr()) {
          return errAsync(paymentTypeRes.error);
        } else {
          paymentType = paymentTypeRes.value;
        }

        if (idRes.isErr()) {
          return errAsync(idRes.error);
        }

        return this.sortTransfers(paymentId, transfers);
      })
      .andThen((sortedTransfersUnk) => {
        const sortedTransfers = sortedTransfersUnk as SortedTransfers;
        const paymentState = this.getPaymentState(sortedTransfers);

        // TODO: Figure out how to determine if the payment is Challenged

        if (paymentType === EPaymentType.Pull) {
          return this.transfersToPullPayment(
            paymentId,
            sortedTransfers.offerDetails.to,
            sortedTransfers.offerDetails.from,
            paymentState,
            sortedTransfers,
          );
        } else if (paymentType === EPaymentType.Push) {
          return this.transfersToPushPayment(
            paymentId,
            sortedTransfers.offerDetails.to,
            sortedTransfers.offerDetails.from,
            paymentState,
            sortedTransfers,
          );
        }

        return errAsync(new InvalidPaymentError(`Payment type ${paymentType} is unsupported!`));
      });
  }

  public getPaymentState(sortedTransfers: SortedTransfers): EPaymentState {
    // Determine the state of the payment. There is really a flowchart for doing this,
    // payments move through a set of states.
    // The main considerations here are the presence of each kind of transfer,
    // whether the transfer is resolved or active, and whether or not the transfer
    // matches the terms of the offer.

    // First thing that can disqualify everything else is if there is no offer transfer
    // at all. This will probably error at higher levels but we should check it here just
    // in case
    if (sortedTransfers.offerTransfer == null) {
      return EPaymentState.InvalidProposal;
    }

    const offerState = this.vectorUtils.getTransferStateFromTransfer(sortedTransfers.offerTransfer);
    const hasInsurance = sortedTransfers.insuranceTransfer != null;
    const hasParameterized = sortedTransfers.parameterizedTransfer != null;

    // Payments that only have an offer
    if (!hasInsurance && !hasParameterized) {
      // Now we know we have something we can use. The first state it can be in is Proposed
      if (offerState == ETransferState.Active) {
        return EPaymentState.Proposed;
      }

      // It could also be rejected
      if (offerState == ETransferState.Resolved) {
        return EPaymentState.Rejected;
      }
    }

    // States with insurance
    if (sortedTransfers.insuranceTransfer != null) {
      const insuranceState = this.vectorUtils.getTransferStateFromTransfer(sortedTransfers.insuranceTransfer);
      const insuranceValid = this.validateInsuranceTransfer(
        sortedTransfers.insuranceTransfer,
        sortedTransfers.offerDetails,
      );

      // Insurance but no parameterized payment
      if (!hasParameterized) {
        if (offerState == ETransferState.Active && insuranceState == ETransferState.Active && insuranceValid) {
          return EPaymentState.Staked;
        }

        if (offerState == ETransferState.Active && insuranceState == ETransferState.Active && !insuranceValid) {
          return EPaymentState.InvalidStake;
        }

        // If their is a resolved insurance payment but no parameterized payemnt,
        // what are we dealing with? TODO
      }

      // Now we can do states with all 3 payments
      if (sortedTransfers.parameterizedTransfer != null && insuranceValid) {
        const paymentState = this.vectorUtils.getTransferStateFromTransfer(sortedTransfers.parameterizedTransfer);
        const paymentValid = this.validatePaymentTransfer(
          sortedTransfers.parameterizedTransfer,
          sortedTransfers.offerDetails,
        );

        if (
          offerState == ETransferState.Active &&
          insuranceState == ETransferState.Active &&
          paymentState == ETransferState.Active &&
          paymentValid
        ) {
          return EPaymentState.Approved;
        }

        if (
          offerState == ETransferState.Active &&
          insuranceState == ETransferState.Active &&
          paymentState == ETransferState.Active &&
          !paymentValid
        ) {
          return EPaymentState.InvalidFunds;
        }

        if (
          offerState == ETransferState.Active &&
          insuranceState == ETransferState.Active &&
          paymentState == ETransferState.Resolved &&
          paymentValid
        ) {
          return EPaymentState.Accepted;
        }

        if (
          offerState == ETransferState.Active &&
          insuranceState == ETransferState.Resolved &&
          paymentState == ETransferState.Resolved &&
          paymentValid
        ) {
          return EPaymentState.InsuranceReleased;
        }

        if (
          offerState == ETransferState.Resolved &&
          insuranceState == ETransferState.Resolved &&
          paymentState == ETransferState.Resolved &&
          paymentValid
        ) {
          return EPaymentState.Finalized;
        }
      }
    }

    // If none of the above states match, the payment is well and truly EPaymentState.Borked
    return EPaymentState.Borked;
  }

  // Returns true if the insurance transfer is
  protected validateInsuranceTransfer(
    transfer: IFullTransferState<InsuranceState>,
    offerDetails: IHypernetOfferDetails,
  ): boolean {
    return BigNumber.from(transfer.transferState.collateral).eq(BigNumber.from(offerDetails.requiredStake));
  }

  protected validatePaymentTransfer(
    transfer: IFullTransferState<ParameterizedState>,
    offerDetails: IHypernetOfferDetails,
  ): boolean {
    let total = BigNumber.from(0);
    for (const amount of transfer.balance.amount) {
      total = total.add(amount);
    }

    return total.eq(BigNumber.from(offerDetails.paymentAmount));

    // TODO: Validate the rate is set correctly
    // && transfer.transferState.rate == offerDetails.;
  }

  /**
   * Given an array of (unsorted) Vector transfers, return the corresponding Hypernet Payments
   * @param transfers array of unsorted Vector transfers as IFullTransferState
   * @param config instance of HypernetConfig
   * @param _context instance of HypernetContext
   * @param browserNode instance of the IBrowserNode
   */
  public transfersToPayments(transfers: IFullTransferState[]): ResultAsync<Payment[], InvalidPaymentError> {
    // First step, get the transfer types for all the transfers
    const transferTypeResults = new Array<
      ResultAsync<{ transferType: ETransferType; transfer: IFullTransferState }, VectorError | Error>
    >();
    for (const transfer of transfers) {
      transferTypeResults.push(this.getTransferTypeWithTransfer(transfer));
    }

    return ResultUtils.combine(transferTypeResults).andThen((transferTypesWithTransfers) => {
      const transfersByPaymentId = new Map<string, IFullTransferState[]>();
      for (const { transferType, transfer } of transferTypesWithTransfers) {
        let paymentId: string;
        if (transferType === ETransferType.Offer) {
          // @todo also add in PullRecord type)
          const offerDetails: IHypernetOfferDetails = JSON.parse(transfer.transferState.message);
          paymentId = offerDetails.paymentId;
        } else if (transferType === ETransferType.Insurance || transferType === ETransferType.Parameterized) {
          paymentId = transfer.transferState.UUID;
        } else {
          this.logUtils.log(
            `Transfer type was not recognized, doing nothing. TransferType: '${transfer.transferDefinition}'`,
          );
          continue;
        }

        // Get the existing array of payments. Initialize it if it's not there.
        let transferArray = transfersByPaymentId.get(paymentId);
        if (transferArray === undefined) {
          transferArray = [];
          transfersByPaymentId.set(paymentId, transferArray);
        }

        transferArray.push(transfer);
      }

      // Now we have the transfers sorted by their payment ID.
      // Loop over them and convert them to proper payments.
      // This is all async, so we can do the whole thing in parallel.
      const paymentResults = new Array<ResultAsync<Payment, InvalidPaymentError | InvalidParametersError>>();
      transfersByPaymentId.forEach((transferArray, paymentId) => {
        const paymentResult = this.transfersToPayment(paymentId, transferArray);
        paymentResults.push(paymentResult);
      });

      return ResultUtils.combine(paymentResults);
    });
  }

  /**
   * Given a (vector) transfer @ IFullTransferState, return the transfer type (as ETransferType)
   * @param transfer the transfer to get the transfer type of
   * @param browserNode instance of a browserNode so that we can query for registered transfer addresses
   */
  public getTransferType(transfer: IFullTransferState): ResultAsync<ETransferType, VectorError | LogicalError> {
    // TransferDefinition here is the ETH address of the transfer
    // We need to get the registered transfer definitions as canonical by the browser node
    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        return browserNode.getRegisteredTransfers(1337);
      })
      .andThen((registeredTransfers) => {
        // registeredTransfers.name = 'Insurance', registeredTransfers.definition = <address>, transfer.transferDefinition = <address>
        const transferMap: Map<EthereumAddress, string> = new Map();
        for (const registeredTransfer of registeredTransfers) {
          transferMap.set(registeredTransfer.definition, registeredTransfer.name);
        }

        // If the transfer address is not one we know, we don't know what this is
        if (!transferMap.has(transfer.transferDefinition)) {
          this.logUtils.log(
            `Transfer type not recognized. Transfer definition: ${
              transfer.transferDefinition
            }, transferMap: ${JSON.stringify(transferMap)}`,
          );
          return okAsync(ETransferType.Unrecognized);
        } else {
          // This is a transfer we know about, but not necessarily one we want.
          // Narrow down to insurance, parameterized, or  offer/messagetransfer
          const thisTransfer = transferMap.get(transfer.transferDefinition);
          if (thisTransfer == null) {
            return errAsync(new LogicalError("Transfer type not unrecognized, but not in transfer map!"));
          }

          // Now we know it's either insurance, parameterized, or messageTransfer
          if (thisTransfer === "Insurance") {
            return okAsync(ETransferType.Insurance);
          } else if (thisTransfer === "Parameterized") {
            return okAsync(ETransferType.Parameterized);
          } else if (thisTransfer === "MessageTransfer") {
            const message: IMessageTransferData = JSON.parse(transfer.transferState.message);
            if (message.messageType == EMessageTransferType.OFFER) {
              return okAsync(ETransferType.Offer);
            } else if (message.messageType == EMessageTransferType.PULLPAYMENT) {
              return okAsync(ETransferType.PullRecord);
            } else {
              return errAsync(
                new LogicalError(`Message transfer was not of type OFFER or PULLPAYMENT, got: ${message.messageType}`),
              );
            }
          } else {
            // It's a recognized transfer type- like Withdraw- that we just don't care about
            return okAsync(ETransferType.Unrecognized);
          }
        }
      });
  }

  /**
   * Exactly the same as getTransferType but also returns the source transfer,
   * useful when dealing with combine() and other contexts where it is easy
   * to loose track of which transfer you are getting the type for.
   */
  public getTransferTypeWithTransfer(
    transfer: IFullTransferState,
  ): ResultAsync<{ transferType: ETransferType; transfer: IFullTransferState }, VectorError | Error> {
    return this.getTransferType(transfer).map((transferType) => {
      return { transferType, transfer };
    });
  }

  /**
   * Given a paymentID and matching transfers for this paymentId, return the SortedTransfers object associated.
   * SortedTransfers is an object containing up to 1 of each of Offer, Insurance, Parameterized, PullRecord, and
   * the metadata associated with this payment (as IHypernetOfferDetails).
   * @param _paymentId the paymentId for the provided transfers
   * @param transfers the transfers to sort
   * @param browserNode instance of a browserNode so that we can query for registered transfer addresses
   */
  public sortTransfers(
    _paymentId: string,
    transfers: IFullTransferState[],
  ): ResultAsync<SortedTransfers, InvalidPaymentError | VectorError | Error> {
    const offerTransfers: IFullTransferState[] = [];
    const insuranceTransfers: IFullTransferState[] = [];
    const parameterizedTransfers: IFullTransferState[] = [];
    const pullTransfers: IFullTransferState[] = [];
    const unrecognizedTransfers: IFullTransferState[] = [];
    const transferTypeResults = new Array<
      ResultAsync<{ transferType: ETransferType; transfer: IFullTransferState }, VectorError | Error>
    >();

    for (const transfer of transfers) {
      transferTypeResults.push(this.getTransferTypeWithTransfer(transfer));
    }

    return ResultUtils.combine(transferTypeResults).andThen((transferTypesWithTransfers) => {
      for (const { transferType, transfer } of transferTypesWithTransfers) {
        if (transferType === ETransferType.Offer) {
          offerTransfers.push(transfer);
        } else if (transferType === ETransferType.Insurance) {
          insuranceTransfers.push(transfer);
        } else if (transferType === ETransferType.Parameterized) {
          parameterizedTransfers.push(transfer);
        } else if (transferType === ETransferType.PullRecord) {
          pullTransfers.push(transfer);
        } else if (transferType === ETransferType.Unrecognized) {
          unrecognizedTransfers.push(transfer);
        } else {
          this.logUtils.log("Unreachable code reached!");
          unrecognizedTransfers.push(transfer);
        }
      }

      this.logUtils.debug(`
        PaymentUtils:sortTransfers
  
        offerTransfers: ${offerTransfers.length}
        insuranceTransfers: ${insuranceTransfers.length}
        parameterizedTransfers: ${parameterizedTransfers.length}
        pullTransfers: ${pullTransfers.length}
        unrecognizedTransfers: ${unrecognizedTransfers.length}
      `);

      if (unrecognizedTransfers.length > 0) {
        return errAsync(new InvalidPaymentError("Payment includes unrecognized transfer types!"));
      }

      if (offerTransfers.length !== 1) {
        // TODO: this could be handled more elegantly; if there's other payments
        // but no offer, it's still a valid payment
        return errAsync(new InvalidPaymentError("Invalid payment, no offer transfer!"));
      }
      const offerTransfer = offerTransfers[0];

      // The details of the offer are encoded in the transfer state, we'll pull it out
      // and deserialize it ot get the hypernet transfer metadata
      const offerDetails: IHypernetOfferDetails = JSON.parse((offerTransfer.transferState as MessageState).message);

      let insuranceTransfer: IFullTransferState | null = null;
      if (insuranceTransfers.length === 1) {
        insuranceTransfer = insuranceTransfers[0];
      } else if (insuranceTransfers.length > 1) {
        return errAsync(new InvalidPaymentError("Invalid payment, too many insurance transfers!"));
      }

      let parameterizedTransfer: IFullTransferState | null = null;
      if (parameterizedTransfers.length === 1) {
        parameterizedTransfer = parameterizedTransfers[0];
      } else if (parameterizedTransfers.length > 1) {
        return errAsync(new InvalidPaymentError("Invalid payment, too many parameterized transfers!"));
      }

      return okAsync(
        new SortedTransfers(offerTransfer, insuranceTransfer, parameterizedTransfer, pullTransfers, offerDetails),
      );
    });
  }

  public getEarliestDateFromTransfers(transfers: IFullTransferState[]): number {
    // If there are no transfers, the earliest transfer would be now
    if (transfers.length == 0) {
      return this.timeUtils.getUnixNow();
    }

    // The earliest date should be a message transfer. We put the creation date
    // in each transfer's metadata to make this easier though.
    transfers.sort((a, b) => {
      const aTime = this.vectorUtils.getTimestampFromTransfer(a);
      const bTime = this.vectorUtils.getTimestampFromTransfer(b);

      return aTime > bTime ? 1 : -1;
    });

    return this.vectorUtils.getTimestampFromTransfer(transfers[0]);
  }

  protected getRegisteredTransfersResponse: ResultAsync<IRegisteredTransfer[], VectorError> | undefined;
  protected getRegisteredTransfers(): ResultAsync<IRegisteredTransfer[], VectorError> {
    if (this.getRegisteredTransfersResponse == null) {
      this.getRegisteredTransfersResponse = ResultUtils.combine([
        this.browserNodeProvider.getBrowserNode(),
        this.configProvider.getConfig(),
      ]).andThen((vals) => {
        const [browserNode, config] = vals;

        return browserNode.getRegisteredTransfers(config.chainId);
      });
    }

    return this.getRegisteredTransfersResponse;
  }
}
