import { HypernetLink } from "./HypernetLink";
import { Subject } from "rxjs";
import { EstablishLinkRequestWithApproval, EstablishLinkRequest } from "./EstablishLinkRequest";
import { ControlClaim } from "./ControlClaim";
import { EthereumAddress } from "3box";
import { PublicIdentifier } from "@connext/vector-types";

export class HypernetContext {
  constructor(
    public account: EthereumAddress | null,
    public accountMnemonic: string | null,
    public publicIdentifier: PublicIdentifier | null,
    public inControl: boolean,
    public onLinkUpdated: Subject<HypernetLink>,
    public onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>,
    public onLinkRejected: Subject<EstablishLinkRequest>,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
  ) {}
}

export class InitializedHypernetContext {
  constructor(
    public account: EthereumAddress,
    public accountMnemonic: string,
    public publicIdentifier: PublicIdentifier,
    public inControl: boolean,
    public onLinkUpdated: Subject<HypernetLink>,
    public onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>,
    public onLinkRejected: Subject<EstablishLinkRequest>,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
  ) {}
}