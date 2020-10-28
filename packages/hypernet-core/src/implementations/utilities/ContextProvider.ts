import {
  HypernetContext,
  HypernetLink,
  EstablishLinkRequest,
  EstablishLinkRequestWithApproval,
  ControlClaim,
  InitializedHypernetContext,
} from "@interfaces/objects";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { Subject } from "rxjs";

export class ContextProvider implements IContextProvider {
  protected context: HypernetContext;
  constructor(
    onLinkUpdated: Subject<HypernetLink>,
    onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>,
    onLinkRejected: Subject<EstablishLinkRequest>,
    onControlClaimed: Subject<ControlClaim>,
    onControlYielded: Subject<ControlClaim>,
  ) {
    this.context = new HypernetContext(
      null,
      null,
      null,
      false,
      onLinkUpdated,
      onLinkRequestReceived,
      onLinkRejected,
      onControlClaimed,
      onControlYielded,
    );
  }
  public async getContext(): Promise<HypernetContext> {
    return this.context;
  }

  public async getInitializedContext(): Promise<InitializedHypernetContext> {
    if (this.context.account == null || this.context.publicIdentifier == null
      || this.context.accountMnemonic == null) {
      throw new Error("Can not open a link until you have set your working account. Call HypernetCore.initialize()!")
    }

    return new InitializedHypernetContext(this.context.account,
      this.context.accountMnemonic,
      this.context.publicIdentifier,
      this.context.inControl,
      this.context.onLinkUpdated,
      this.context.onLinkRequestReceived,
      this.context.onLinkRejected,
      this.context.onControlClaimed,
      this.context.onControlYielded);
  }

  public setContext(context: HypernetContext): void {
    this.context = context;
  }
}
