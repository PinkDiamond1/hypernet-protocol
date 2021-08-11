import {
  IAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  ISendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import {
  Balances,
  GatewayActivationError,
  GatewayConnectorError,
  GatewayUrl,
  GatewayValidationError,
  ProxyError,
  PublicIdentifier,
  Signature,
  PullPayment,
  PushPayment,
  IStateChannelRequest,
  ChainId,
  EthereumAddress,
  UUID,
} from "@hypernetlabs/objects";
import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

export interface IGatewayConnectorProxy extends ParentProxy {
  gatewayUrl: GatewayUrl;

  /**
   * activateProxy() sets up the gateway iframe and the communication
   * channel to the iframe. Not.hing else is done
   */
  activateProxy(): ResultAsync<void, ProxyError>;

  /**
   * activateConnector() will actual cause the connector code to execute. This should only
   * be done if the user has authorized the connector.
   */
  activateConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<void, GatewayActivationError | ProxyError>;

  deauthorize(): ResultAsync<void, never>;

  /**
   * getValidatedSignature() requests the gateway iframe to return the
   * signature of the connector code, AFTER validating that the connector
   * code matches the signature.
   */
  getValidatedSignature(): ResultAsync<
    Signature,
    GatewayValidationError | ProxyError
  >;

  closeGatewayIFrame(): ResultAsync<void, GatewayConnectorError | ProxyError>;

  displayGatewayIFrame(): ResultAsync<void, GatewayConnectorError | ProxyError>;

  notifyPushPaymentSent(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPushPaymentUpdated(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPushPaymentReceived(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPushPaymentDelayed(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPushPaymentCanceled(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;

  notifyPullPaymentSent(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPullPaymentUpdated(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPullPaymentReceived(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPullPaymentDelayed(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPullPaymentCanceled(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;

  notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;

  messageSigned(
    message: string,
    signature: Signature,
  ): ResultAsync<void, ProxyError>;

  returnStateChannel(
    id: UUID,
    channelAddress: EthereumAddress,
  ): ResultAsync<void, ProxyError>;

  // Signals to the outside world
  signMessageRequested: Observable<string>;
  sendFundsRequested: Observable<ISendFundsRequest>;
  authorizeFundsRequested: Observable<IAuthorizeFundsRequest>;
  resolveInsuranceRequested: Observable<IResolveInsuranceRequest>;
  stateChannelRequested: Observable<IStateChannelRequest>;
}
