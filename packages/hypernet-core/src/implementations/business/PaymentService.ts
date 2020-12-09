import { Result } from "@connext/vector-types";
import { IPaymentService } from "@interfaces/business";
import { IAccountsRepository, ILinkRepository } from "@interfaces/data";
import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import {
  BigNumber,
  EthereumAddress, Payment,
  PublicIdentifier, PublicKey,
  PullPayment, PushPayment
} from "@interfaces/objects";
import { EPaymentState } from "@interfaces/types";
import { IConfigProvider, IContextProvider } from "@interfaces/utilities";

/**
 * PaymentService uses Vector internally to send payments on the requested channel.
 * The order of operations for sending funds is as follows:
 * sendFunds() is called by sender, which creates a Message transfer with Vector, which triggers
 * offerReceived() on the recipient side, which tosses an event up to the user, who then calls
 * acceptFunds() to accept the sender's funds, which creates an Insurance transfer with Vector, which triggers
 * stakePosted() on the sender's side, which finally creates the Parameterized transfer with Vector, which triggers
 * paymentPosted() on the recipient's side, which finalizes/resolves the vector parameterized transfer.
 * @todo we should also finalize the insurance transfer, and maybe finalize the offer transfer
 */
export class PaymentService implements IPaymentService {

  /**
   * Creates an instanceo of the paymentService.
   */
  constructor(
    protected linkRepository: ILinkRepository,
    protected accountRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
    protected configProvider: IConfigProvider,
    protected paymentRepository: IPaymentRepository,
  ) {}

  /**
   * Sends a payment to the specified recipient.
   * Internally, creates a null/message/offer transfer to communicate
   * with the counterparty and signal a request for a stake.
   * @param counterPartyAccount the intended recipient
   * @param amount the amount of payment to send
   * @param expirationDate the expiration date at which point this payment will revert
   * @param requiredStake the amount of insurance the counterparty should put up
   * @param paymentToken the (Ethereum) address of the payment token
   * @param disputeMediator the (Ethereum) address of the dispute mediator
   */
  public async sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment> {
    const payment = this.paymentRepository.createPushPayment(
      counterPartyAccount,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      disputeMediator,
    );

    return payment;
  }

   /**
   * Called when someone has sent us a payment offer.
   * Lookup the transfer, and convert it to a payment. 
   * Then, publish an RXJS event to the user.
   * @param paymentId the paymentId for the offer
   */
  public async offerReceived(paymentId: string): Promise<void> {
    const paymentsPromise = this.paymentRepository.getPaymentsByIds([paymentId]);
    const contextPromise = this.contextProvider.getInitializedContext();
    const [payments, context] = await Promise.all([paymentsPromise, contextPromise]);

    const payment = payments.get(paymentId);

    if (payment == null) {
      throw new Error(`PaymentService:offerReceived():Could not get payment!`);
    }

    if (payment.state !== EPaymentState.Proposed) {
      // The payment has already moved forward, somehow.
      // We don't need to do anything, we probably got called
      // by another instance of the core.
      return;
    }

    // Payment state is 'Proposed', continue to handle

    if (payment instanceof PushPayment) {
      // Someone wants to send us a pushPayment, emit up to the api
      context.onPushPaymentProposed.next(payment);
    } else if (payment instanceof PullPayment) {
      // Someone wants to send us a pullPayment, emit up to the api
      context.onPullPaymentProposed.next(payment);
    } else {
      throw new Error("Unknown payment type!");
    }
  }

  /**
   * For each paymentID provided, attempts to accept funds for that payment.
   * @param paymentIds a list of paymentIds for which to accept funds for
   */
  public async acceptFunds(paymentIds: string[]): Promise<Result<Payment, Error>[]> {
    const config = await this.configProvider.getConfig();
    const payments = await this.paymentRepository.getPaymentsByIds(paymentIds);
    const hypertokenBalance = await this.accountRepository.getBalanceByAsset(config.hypertokenAddress);

    // For each payment ID, call the singular version of acceptFunds
    // Wrap each one as a Result object, and return an array of Results
    let results: Result<Payment, Error>[] = [];

    let totalStakeRequired = BigNumber.from(0);
    // First, verify to make sure that we have enough hypertoken to cover the insurance collectively
    payments.forEach((payment) => {
      if (payment.state !== EPaymentState.Proposed) {
        throw new Error(`Cannot accept payment ${payment.id}, it is not in the Proposed state`);
      }

      totalStakeRequired = totalStakeRequired.add(BigNumber.from(payment.requiredStake));
    });

    // Check the balance and make sure you have enough HyperToken to cover it
    if (hypertokenBalance.freeAmount < totalStakeRequired) {
      throw new Error("Not enough Hypertoken to cover provided payments.");
    }

    // Now that we know we can (probably) make the payments, let's try
    for (let paymentId of paymentIds) {
      try {
        console.log(`PaymentService:acceptFunds: attempting to provide stake for payment ${paymentId}`)
        const payment = await this.paymentRepository.provideStake(paymentId);
        results.push(Result.ok(payment));
      } catch (err) {
        results.push(Result.fail(err));
      }
    }

    return results;
  }

  /**
   * Notifies the service that a stake has been posted; if verified,
   * then provides assets to the counterparty (ie a parameterizedPayment)
   * @param paymentId the paymentId for the stake
   */
  public async stakePosted(paymentId: string): Promise<void> {
    const payments = await this.paymentRepository.getPaymentsByIds([paymentId]);
    const payment = payments.get(paymentId);

    // Payment state must be in "staked" in order to progress
    if (payment == null || payment.state !== EPaymentState.Staked) {
      throw new Error(`Invalid payment ${paymentId}, cannot provide payment!`);
    }

    // If the payment state is staked, we know that the proper
    // insurance has been posted.
    await this.paymentRepository.provideAsset(paymentId);
  }

  /**
   * Notifies the service that the parameterized payment has been created.
   * Called by the reciever of a parameterized transfer, AFTER they have put up stake
   * @param paymentId the payment ID to accept/resolve
   */
  public async paymentPosted(paymentId: string): Promise<void> {
    const payments = await this.paymentRepository.getPaymentsByIds([paymentId]);
    const payment = payments.get(paymentId);

    // Payment state must be in "approved" to finalize
    if (payment == null || payment.state !== EPaymentState.Approved) {
      throw new Error(`Cannot accept payment ${paymentId}`);
    }

    // If the payment state is approved, we know that it matches our insurance payment
    if (payment instanceof PushPayment) {
      // Resolve the parameterized payment immediately
      await this.paymentRepository.finalizePayment(paymentId);
    } else if (payment instanceof PullPayment) {
      // Notify the user that the funds have been approved.
      const context = await this.contextProvider.getContext();
      context.onPullPaymentApproved.next(payment);
    }
  }

  /**
   * Notifies the service that a pull-payment has been recorded.
   * @param paymentId the paymentId for the pull-payment
   */
  public async pullRecorded(paymentId: string): Promise<void> {
    const payments = await this.paymentRepository.getPaymentsByIds([paymentId]);
    const payment = payments.get(paymentId);

    throw new Error("Method not yet implemented");
  }

  /**
   * Requests a payment on the specified channel.
   * @param channelId the (Vector) channelId to request the payment on
   * @param amount the amount of payment to request
   */
  requestPayment(channelId: string, amount: BigNumber): Promise<Payment> {
    throw new Error("Method not implemented.");
  }
}
