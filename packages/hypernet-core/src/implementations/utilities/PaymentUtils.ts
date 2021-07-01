import {
  EthereumAddress,
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
  BlockchainUnavailableError,
  PaymentId,
  UUID,
  TransferId,
  InvalidParametersError,
  InvalidPaymentError,
  InvalidPaymentIdError,
  LogicalError,
  VectorError,
  EPaymentState,
  EPaymentType,
  ETransferState,
  ETransferType,
  InsuranceState,
  MessageState,
  ParameterizedState,
  EMessageTransferType,
  BigNumberString,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IBrowserNodeProvider,
  IConfigProvider,
  IPaymentIdUtils,
  IPaymentUtils,
  ITimeUtils,
  IVectorUtils,
} from "@interfaces/utilities";

/* eslint-disable */
import { v4 as uuidv4 } from "uuid";
/* eslint-enable */

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
  public isHypernetDomain(
    paymentId: PaymentId,
  ): ResultAsync<boolean, InvalidPaymentIdError> {
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
  public createPaymentId(
    paymentType: EPaymentType,
  ): ResultAsync<PaymentId, InvalidParametersError> {
    return this.configProvider.getConfig().andThen((config) => {
      return this.paymentIdUtils.makePaymentId(
        config.hypernetProtocolDomain,
        paymentType,
        UUID(uuidv4()),
      );
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
    paymentId: PaymentId,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
  ): ResultAsync<PushPayment, LogicalError> {
    /**
     * Push payments consist of 3 transfers:
     * MessageTransfer - 0 value, represents an offer
     * InsuranceTransfer - service operator puts up to guarantee the sender's funds
     * ParameterizedPayment - the payment to the service operator
     */

    if (sortedTransfers.pullRecordTransfers.length > 0) {
      throw new LogicalError("Push payment has pull transfers!");
    }

    let amountStaked = BigNumberString("0");
    let insuranceTransferId: TransferId | null = null;
    if (sortedTransfers.insuranceTransfers.length > 0) {
      amountStaked = BigNumberString(
        sortedTransfers.insuranceTransfers[0].balance.amount[0],
      );
      insuranceTransferId = TransferId(
        sortedTransfers.insuranceTransfers[0].transferId,
      );
    }
    const paymentAmount = sortedTransfers.offerDetails.paymentAmount;

    let amountTransfered = BigNumberString("0");
    let parameterizedTransferId: TransferId | null = null;
    let paymentToken = sortedTransfers.offerDetails.paymentToken;
    if (sortedTransfers.parameterizedTransfers.length > 0) {
      amountTransfered = BigNumberString(
        sortedTransfers.parameterizedTransfers[0].balance.amount[0],
      );
      parameterizedTransferId = TransferId(
        sortedTransfers.parameterizedTransfers[0].transferId,
      );
      paymentToken = EthereumAddress(
        sortedTransfers.parameterizedTransfers[0].assetId,
      );
    }

    const details = new PaymentInternalDetails(
      TransferId(sortedTransfers.offerTransfers[0].transferId),
      insuranceTransferId,
      parameterizedTransferId,
      sortedTransfers.pullRecordTransfers.map((val) => {
        return TransferId(val.transferId);
      }),
    );

    return okAsync(
      new PushPayment(
        paymentId,
        to,
        from,
        state,
        paymentToken,
        sortedTransfers.offerDetails.requiredStake,
        amountStaked,
        sortedTransfers.offerDetails.expirationDate,
        sortedTransfers.offerDetails.creationDate,
        this.timeUtils.getUnixNow(),
        BigNumberString("0"),
        sortedTransfers.offerDetails.gatewayUrl,
        details,
        sortedTransfers.offerDetails.metadata,
        paymentAmount,
        amountTransfered,
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
    paymentId: PaymentId,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
  ): ResultAsync<PullPayment, LogicalError> {
    /**
     * Pull payments consist of 3+ transfers, a null transfer for 0 value that represents the
     * offer, an insurance payment, and a parameterized payment.
     */
    let amountStaked = BigNumberString("0");
    let insuranceTransferId: TransferId | null = null;
    if (sortedTransfers.insuranceTransfers.length > 0) {
      amountStaked = BigNumberString(
        sortedTransfers.insuranceTransfers[0].balance.amount[0],
      );
      insuranceTransferId = TransferId(
        sortedTransfers.insuranceTransfers[0].transferId,
      );
    }

    // Get deltaAmount & deltaTime from the parameterized payment
    if (sortedTransfers.offerDetails.rate == null) {
      return errAsync(
        new LogicalError("These transfers are not for a pull payment."),
      );
    }

    const deltaAmount = BigNumber.from(
      sortedTransfers.offerDetails.rate.deltaAmount,
    );
    const deltaTime = sortedTransfers.offerDetails.rate.deltaTime;
    let vestedAmount: BigNumber;
    let parameterizedTransferId: TransferId | null = null;

    if (sortedTransfers.parameterizedTransfers.length == 0) {
      // No paramterized transfer, no vested amount!
      vestedAmount = BigNumber.from(0);
    } else {
      // Calculate vestedAmount
      const now = this.timeUtils.getUnixNow();
      const timePassed =
        now -
        Number(sortedTransfers.parameterizedTransfers[0].transferState.start);
      vestedAmount = deltaAmount.div(deltaTime).mul(timePassed);
      parameterizedTransferId = TransferId(
        sortedTransfers.parameterizedTransfers[0].transferId,
      );
    }

    // Convert the PullRecords to PullAmounts
    const pullAmounts = new Array<PullAmount>();

    for (const pullRecord of sortedTransfers.pullRecordTransfers) {
      const message = JSON.parse(
        pullRecord.transferState.message,
      ) as IHypernetPullPaymentDetails;
      pullAmounts.push(
        new PullAmount(
          BigNumber.from(message.pullPaymentAmount),
          this.vectorUtils.getTimestampFromTransfer(pullRecord),
        ),
      );
    }

    const paymentToken =
      sortedTransfers.parameterizedTransfers.length > 0
        ? EthereumAddress(sortedTransfers.parameterizedTransfers[0].assetId)
        : sortedTransfers.offerDetails.paymentToken;

    const details = new PaymentInternalDetails(
      TransferId(sortedTransfers.offerTransfers[0].transferId),
      insuranceTransferId,
      parameterizedTransferId,
      sortedTransfers.pullRecordTransfers.map((val) => {
        return TransferId(val.transferId);
      }),
    );

    return okAsync(
      new PullPayment(
        paymentId,
        to,
        from,
        state,
        paymentToken,
        sortedTransfers.offerDetails.requiredStake,
        amountStaked,
        UnixTimestamp(this.timeUtils.getUnixNow() + 60 * 60), // 1 hour
        sortedTransfers.offerDetails.creationDate,
        this.timeUtils.getUnixNow(),
        BigNumberString("0"),
        sortedTransfers.offerDetails.gatewayUrl,
        details,
        sortedTransfers.offerDetails.metadata,
        sortedTransfers.offerDetails.paymentAmount,
        BigNumberString("0"),
        BigNumberString(vestedAmount.toString()),
        deltaTime,
        BigNumberString(deltaAmount.toString()),
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
    paymentId: PaymentId,
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
          return errAsync<SortedTransfers, InvalidPaymentIdError>(
            domainRes.error,
          );
        }

        // TODO: This should probably be encapsulated down lower; getDomain() is probably unnecessary and and invalid domain should just result in an InvalidPaymentIdError from getType and getUUID.
        if (domainRes.value !== config.hypernetProtocolDomain) {
          return errAsync<SortedTransfers, InvalidParametersError>(
            new InvalidParametersError(
              `Invalid payment domain: '${domainRes.value}'`,
            ),
          );
        }

        if (paymentTypeRes.isErr()) {
          return errAsync<SortedTransfers, InvalidPaymentIdError>(
            paymentTypeRes.error,
          );
        } else {
          paymentType = paymentTypeRes.value;
        }

        if (idRes.isErr()) {
          return errAsync<SortedTransfers, InvalidPaymentIdError>(idRes.error);
        }

        return this.sortTransfers(paymentId, transfers);
      })
      .andThen((sortedTransfers) => {
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

        return errAsync(
          new InvalidPaymentError(
            `Payment type ${paymentType} is unsupported!`,
          ),
        );
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
    if (sortedTransfers.offerTransfers.length == 0) {
      return EPaymentState.InvalidProposal;
    }

    if (sortedTransfers.offerTransfers.length > 1) {
      return EPaymentState.Borked;
    }

    const offerState = this.vectorUtils.getTransferStateFromTransfer(
      sortedTransfers.offerTransfers[0],
    );

    if (sortedTransfers.insuranceTransfers.length > 1) {
      return EPaymentState.Borked;
    }

    if (sortedTransfers.parameterizedTransfers.length > 1) {
      return EPaymentState.Borked;
    }

    const hasInsurance = sortedTransfers.insuranceTransfers.length == 1;
    const hasParameterized = sortedTransfers.parameterizedTransfers.length == 1;

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
    if (hasInsurance) {
      const insuranceState = this.vectorUtils.getTransferStateFromTransfer(
        sortedTransfers.insuranceTransfers[0],
      );
      const insuranceValid = this.validateInsuranceTransfer(
        sortedTransfers.insuranceTransfers[0],
        sortedTransfers.offerDetails,
      );

      // Insurance but no parameterized payment
      if (!hasParameterized) {
        if (
          offerState == ETransferState.Active &&
          insuranceState == ETransferState.Active &&
          insuranceValid
        ) {
          return EPaymentState.Staked;
        }

        if (
          offerState == ETransferState.Active &&
          insuranceState == ETransferState.Active &&
          !insuranceValid
        ) {
          return EPaymentState.InvalidStake;
        }

        // If their is a resolved insurance payment but no parameterized payemnt,
        // what are we dealing with? TODO
      }

      // Now we can do states with all 3 payments
      if (sortedTransfers.parameterizedTransfers[0] != null && insuranceValid) {
        const paymentState = this.vectorUtils.getTransferStateFromTransfer(
          sortedTransfers.parameterizedTransfers[0],
        );
        const paymentValid = this.validatePaymentTransfer(
          sortedTransfers.parameterizedTransfers[0],
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
    return BigNumber.from(transfer.transferState.collateral).eq(
      BigNumber.from(offerDetails.requiredStake),
    );
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
  public transfersToPayments(
    transfers: IFullTransferState[],
  ): ResultAsync<
    Payment[],
    VectorError | LogicalError | InvalidPaymentError | InvalidParametersError
  > {
    // First step, get the transfer types for all the transfers
    const transferTypeResults = new Array<
      ResultAsync<
        { transferType: ETransferType; transfer: IFullTransferState },
        VectorError | Error
      >
    >();
    for (const transfer of transfers) {
      transferTypeResults.push(this.getTransferTypeWithTransfer(transfer));
    }

    return ResultUtils.combine(transferTypeResults).andThen(
      (transferTypesWithTransfers) => {
        const transfersByPaymentId = new Map<PaymentId, IFullTransferState[]>();
        for (const { transferType, transfer } of transferTypesWithTransfers) {
          let paymentId: PaymentId;
          if (transferType === ETransferType.Offer) {
            // @todo also add in PullRecord type)
            const offerDetails: IHypernetOfferDetails = JSON.parse(
              transfer.transferState.message,
            );
            paymentId = offerDetails.paymentId;
          } else if (
            transferType === ETransferType.Insurance ||
            transferType === ETransferType.Parameterized
          ) {
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
        const paymentResults = new Array<
          ResultAsync<Payment, InvalidPaymentError | InvalidParametersError>
        >();
        transfersByPaymentId.forEach((transferArray, paymentId) => {
          const paymentResult = this.transfersToPayment(
            paymentId,
            transferArray,
          );
          paymentResults.push(paymentResult);
        });

        return ResultUtils.combine(paymentResults);
      },
    );
  }

  /**
   * Given a (vector) transfer @ IFullTransferState, return the transfer type (as ETransferType)
   * @param transfer the transfer to get the transfer type of
   * @param browserNode instance of a browserNode so that we can query for registered transfer addresses
   */
  public getTransferType(
    transfer: IFullTransferState,
  ): ResultAsync<
    ETransferType,
    VectorError | BlockchainUnavailableError | LogicalError
  > {
    // TransferDefinition here is the ETH address of the transfer
    // We need to get the registered transfer definitions as canonical by the browser node
    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
    ])
      .andThen((vals) => {
        const [browserNode, config] = vals;
        return browserNode.getRegisteredTransfers(config.chainId);
      })
      .andThen((registeredTransfers) => {
        // registeredTransfers.name = 'Insurance', registeredTransfers.definition = <address>, transfer.transferDefinition = <address>
        const transferMap: Map<EthereumAddress, string> = new Map();
        for (const registeredTransfer of registeredTransfers) {
          transferMap.set(
            EthereumAddress(registeredTransfer.definition),
            registeredTransfer.name,
          );
        }

        // If the transfer address is not one we know, we don't know what this is
        if (!transferMap.has(EthereumAddress(transfer.transferDefinition))) {
          this.logUtils.log(
            `Transfer type not recognized. Transfer definition: ${
              transfer.transferDefinition
            }, transferMap: ${JSON.stringify(transferMap)}`,
          );
          return okAsync(ETransferType.Unrecognized);
        } else {
          // This is a transfer we know about, but not necessarily one we want.
          // Narrow down to insurance, parameterized, or  offer/messagetransfer
          const thisTransfer = transferMap.get(
            EthereumAddress(transfer.transferDefinition),
          );
          if (thisTransfer == null) {
            return errAsync(
              new LogicalError(
                "Transfer type not unrecognized, but not in transfer map!",
              ),
            );
          }

          // Now we know it's either insurance, parameterized, or messageTransfer
          if (thisTransfer === "Insurance") {
            return okAsync(ETransferType.Insurance);
          } else if (thisTransfer === "Parameterized") {
            return okAsync(ETransferType.Parameterized);
          } else if (thisTransfer === "MessageTransfer") {
            const message: IMessageTransferData = JSON.parse(
              transfer.transferState.message,
            );
            if (message.messageType == EMessageTransferType.OFFER) {
              return okAsync(ETransferType.Offer);
            } else if (
              message.messageType == EMessageTransferType.PULLPAYMENT
            ) {
              return okAsync(ETransferType.PullRecord);
            } else {
              return errAsync(
                new LogicalError(
                  `Message transfer was not of type OFFER or PULLPAYMENT, got: ${message.messageType}`,
                ),
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
  ): ResultAsync<
    { transferType: ETransferType; transfer: IFullTransferState },
    VectorError | LogicalError
  > {
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
  ): ResultAsync<
    SortedTransfers,
    InvalidPaymentError | VectorError | LogicalError
  > {
    const offerTransfers: IFullTransferState[] = [];
    const insuranceTransfers: IFullTransferState[] = [];
    const parameterizedTransfers: IFullTransferState[] = [];
    const pullTransfers: IFullTransferState[] = [];
    const unrecognizedTransfers: IFullTransferState[] = [];
    const transferTypeResults = new Array<
      ResultAsync<
        { transferType: ETransferType; transfer: IFullTransferState },
        VectorError | LogicalError
      >
    >();

    for (const transfer of transfers) {
      transferTypeResults.push(this.getTransferTypeWithTransfer(transfer));
    }

    return ResultUtils.combine(transferTypeResults).andThen(
      (transferTypesWithTransfers) => {
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
          return errAsync(
            new InvalidPaymentError(
              "Payment includes unrecognized transfer types!",
            ),
          );
        }

        if (offerTransfers.length !== 1) {
          // TODO: this could be handled more elegantly; if there's other payments
          // but no offer, it's still a valid payment
          return errAsync(
            new InvalidPaymentError("Invalid payment, no offer transfer!"),
          );
        }
        const offerTransfer = offerTransfers[0];

        // The details of the offer are encoded in the transfer state, we'll pull it out
        // and deserialize it ot get the hypernet transfer metadata
        const offerDetails: IHypernetOfferDetails = JSON.parse(
          (offerTransfer.transferState as MessageState).message,
        );

        return okAsync(
          new SortedTransfers(
            offerTransfers,
            insuranceTransfers,
            parameterizedTransfers,
            pullTransfers,
            offerDetails,
          ),
        );
      },
    );
  }

  public getEarliestDateFromTransfers(
    transfers: IFullTransferState[],
  ): UnixTimestamp {
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

  protected getRegisteredTransfersResponse:
    | ResultAsync<
        IRegisteredTransfer[],
        VectorError | BlockchainUnavailableError
      >
    | undefined;
  protected getRegisteredTransfers(): ResultAsync<
    IRegisteredTransfer[],
    VectorError | BlockchainUnavailableError
  > {
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
