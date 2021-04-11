import { MerchantContext } from "@merchant-iframe/interfaces/objects";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { IMerchantConnector } from "packages/merchant-connector/dist";
import { Subject } from "rxjs";

export class ContextProvider implements IContextProvider {
  protected context: MerchantContext;

  constructor(merchantUrl: string) {
    this.context = new MerchantContext(merchantUrl, new Subject<IMerchantConnector>(), null, null, null,
    null // Public Identifier
    );
  }

  getMerchantContext(): MerchantContext {
    return this.context;
  }

  setMerchantContext(context: MerchantContext): void {
    this.context = context;
  }
}
