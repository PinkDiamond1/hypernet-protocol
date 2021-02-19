import {
  IAuthorizeFundsRequest,
  IMerchantConnector,
  ISendFundsRequest,
  IResolutionResult,
} from "@hypernetlabs/merchant-connector";
import { Subject } from "rxjs";
import { Bytes32 } from "@connext/vector-types";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { ChannelSigner } from "@connext/vector-utils";

declare global {
  interface Window {
    connector: IMerchantConnector;
  }
}

class TestMerchantConnector implements IMerchantConnector {
  async resolveChallenge(paymentId: string): Promise<IResolutionResult> {
    // What the mediator needs to sign:
    // https://github.com/connext/transfers/blob/20f44307164cb245c075cf3723b09d8ff75901d4/tests/insurance/insurance.spec.ts#L399

    // Case: mediator decides to resolve payment in full (ie, the entire insurance payment)
    const resolutionAmount = "1";

    // 1) Construct the ABI snippet for the data we want to sign
    const resolverDataEncoding = ["tuple(uint256 amount, bytes32 UUID)"];

    type InsuranceResolverData = {
      amount: string;
      UUID: Bytes32;
    };

    // 2) Prepare the (un-encoded) data
    const resolverData: InsuranceResolverData = { amount: resolutionAmount, UUID: paymentId };

    // 3) Encode the data
    const encodedData = defaultAbiCoder.encode(resolverDataEncoding, [resolverData]);

    // 4) Hash the data so that it's a set length
    const hashedData = keccak256(encodedData);

    // 5) Sign the hash of the data so that people know we sent it
    const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
    let mediator = new ChannelSigner(privateKey);
    const mediatorSignature = await mediator.signUtilityMessage(hashedData);

    // 6) Return both the signature of the hash of the data & the data itself
    return Promise.resolve({
      mediatorSignature,
      amount: resolutionAmount,
    });
  }
  getPublicKey(): Promise<string> {
    return Promise.resolve(
      "0x046655feed4d214c261e0a6b554395596f1f1476a77d999560e5a8df9b8a1a3515217e88dd05e938efdd71b2cce322bf01da96cd42087b236e8f5043157a9c068e",
    );
  }

  //   paymentCreated(payment: Payment) {
  //       // Send the payment details to galileo
  //   }

  onSendFundsRequested: Subject<ISendFundsRequest>;
  onAuthorizeFundsRequested: Subject<IAuthorizeFundsRequest>;
  onDisplayRequested: Subject<void>;

  constructor() {
    this.onSendFundsRequested = new Subject<ISendFundsRequest>();
    this.onAuthorizeFundsRequested = new Subject<IAuthorizeFundsRequest>();
    this.onDisplayRequested = new Subject<void>();
  }
}

window.connector = new TestMerchantConnector();
