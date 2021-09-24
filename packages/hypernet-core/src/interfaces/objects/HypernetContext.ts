import {
  ControlClaim,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  Balances,
  EthereumAddress,
  GatewayUrl,
  Signature,
  ActiveStateChannel,
  ChainId,
} from "@hypernetlabs/objects";
import { Subject } from "rxjs";

import { IGatewayConnectorProxy } from "@interfaces/utilities";

export class HypernetContext {
  constructor(
    public account: EthereumAddress | null,
    public publicIdentifier: PublicIdentifier | null,
    public activeStateChannels: ActiveStateChannel[] | null,
    public inControl: boolean,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
    public onPushPaymentSent: Subject<PushPayment>,
    public onPullPaymentSent: Subject<PullPayment>,
    public onPushPaymentReceived: Subject<PushPayment>,
    public onPullPaymentReceived: Subject<PullPayment>,
    public onPushPaymentUpdated: Subject<PushPayment>,
    public onPullPaymentUpdated: Subject<PullPayment>,
    public onPushPaymentDelayed: Subject<PushPayment>,
    public onPullPaymentDelayed: Subject<PullPayment>,
    public onPushPaymentCanceled: Subject<PushPayment>,
    public onPullPaymentCanceled: Subject<PullPayment>,
    public onBalancesChanged: Subject<Balances>,
    public onDeStorageAuthenticationStarted: Subject<void>,
    public onDeStorageAuthenticationSucceeded: Subject<void>,
    public onDeStorageAuthenticationFailed: Subject<void>,
    public onGatewayAuthorized: Subject<GatewayUrl>,
    public onGatewayDeauthorizationStarted: Subject<GatewayUrl>,
    public onAuthorizedGatewayUpdated: Subject<GatewayUrl>,
    public onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>,
    public onGatewayIFrameDisplayRequested: Subject<GatewayUrl>,
    public onGatewayIFrameCloseRequested: Subject<GatewayUrl>,
    public onCoreIFrameDisplayRequested: Subject<void>,
    public onCoreIFrameCloseRequested: Subject<void>,
    public onInitializationRequired: Subject<void>,
    public onPrivateCredentialsRequested: Subject<void>,
    public onGatewayConnectorProxyActivated: Subject<IGatewayConnectorProxy>,
    public onStateChannelCreated: Subject<ActiveStateChannel>,
    public onChainConnected: Subject<ChainId>,
    public onGovernanceChainConnected: Subject<ChainId>,
    public onChainChanged: Subject<ChainId>,
    public onAccountChanged: Subject<EthereumAddress>,
    public onGovernanceChainChanged: Subject<ChainId>,
    public onGovernanceAccountChanged: Subject<EthereumAddress>,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class InitializedHypernetContext {
  constructor(
    public account: EthereumAddress,
    public publicIdentifier: PublicIdentifier,
    public activeStateChannels: ActiveStateChannel[],
    public inControl: boolean,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
    public onPushPaymentSent: Subject<PushPayment>,
    public onPullPaymentSent: Subject<PullPayment>,
    public onPushPaymentReceived: Subject<PushPayment>,
    public onPullPaymentReceived: Subject<PullPayment>,
    public onPushPaymentUpdated: Subject<PushPayment>,
    public onPullPaymentUpdated: Subject<PullPayment>,
    public onPushPaymentDelayed: Subject<PushPayment>,
    public onPullPaymentDelayed: Subject<PullPayment>,
    public onPushPaymentCanceled: Subject<PushPayment>,
    public onPullPaymentCanceled: Subject<PullPayment>,
    public onBalancesChanged: Subject<Balances>,
    public onDeStorageAuthenticationStarted: Subject<void>,
    public onDeStorageAuthenticationSucceeded: Subject<void>,
    public onDeStorageAuthenticationFailed: Subject<void>,
    public onGatewayAuthorized: Subject<GatewayUrl>,
    public onGatewayDeauthorizationStarted: Subject<GatewayUrl>,
    public onAuthorizedGatewayUpdated: Subject<GatewayUrl>,
    public onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>,
    public onGatewayIFrameDisplayRequested: Subject<GatewayUrl>,
    public onGatewayIFrameCloseRequested: Subject<GatewayUrl>,
    public onCoreIFrameDisplayRequested: Subject<void>,
    public onCoreIFrameCloseRequested: Subject<void>,
    public onInitializationRequired: Subject<void>,
    public onPrivateCredentialsRequested: Subject<void>,
    public onGatewayConnectorProxyActivated: Subject<IGatewayConnectorProxy>,
    public onStateChannelCreated: Subject<ActiveStateChannel>,
    public onChainConnected: Subject<ChainId>,
    public onGovernanceChainConnected: Subject<ChainId>,
    public onChainChanged: Subject<ChainId>,
    public onAccountChanged: Subject<EthereumAddress>,
    public onGovernanceChainChanged: Subject<ChainId>,
    public onGovernanceAccountChanged: Subject<EthereumAddress>,
    public authorizedMediators: Map<GatewayUrl, Signature>,
  ) {}
}
