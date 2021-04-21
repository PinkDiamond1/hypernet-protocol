import { Balances, EthereumAddress } from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";

import html from "./TokenSelector.template.html";

export class TokenSelectorParams {
  constructor(
    public integration: IHypernetWebIntegration,
    public selectedToken: ko.Observable<EthereumAddress | null>,
    public onlyWithBalance: boolean,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentTokenOption {
  constructor(public tokenName: string, public address: EthereumAddress) {}
}

// tslint:disable-next-line: max-classes-per-file
export class TokenSelectorViewModel {
  public paymentTokens: ko.ObservableArray<PaymentTokenOption>;
  public selectedPaymentTokenOption: ko.Computed<PaymentTokenOption | null>;

  protected integration: IHypernetWebIntegration;
  protected selectedToken: ko.Observable<EthereumAddress | null>;
  protected balances: ko.Observable<Balances | null>;
  protected onlyWithBalance: boolean;

  constructor(params: TokenSelectorParams) {
    this.integration = params.integration;
    this.selectedToken = params.selectedToken;
    this.onlyWithBalance = params.onlyWithBalance;

    this.balances = ko.observable(null);
    this.paymentTokens = ko.observableArray<PaymentTokenOption>();

    this.selectedPaymentTokenOption = ko.pureComputed({
      read: () => {
        const selectedToken = this.selectedToken();
        if (selectedToken == null) {
          // tslint:disable-next-line: no-console
          console.log("No selected token.");
          return null;
        }

        const options = this.paymentTokens();

        for (const option of options) {
          if (option.address === selectedToken) {
            // tslint:disable-next-line: no-console
            console.log(`Selected token: ${option.address}`);
            return option;
          }
        }

        // The selected token is not actually an option...
        // console.log("No selected token.")
        this.selectedToken(null);
        return null;
      },

      write: (val) => {
        // console.log(`Selected token (write) ${val}`)
        this.selectedToken(val == null ? null : val.address);
      },
    });

    this.getBalances();
  }

  public setPaymentTokenOptionValue(option: any, item: any) {
    ko.applyBindingsToNode(option, { attr: { value: item?.tokenName } }, item);
  }

  protected getBalances() {
    if (this.onlyWithBalance) {
      this.integration.core
        .waitInitialized()
        .andThen(() => {
          return this.integration.core.getBalances();
        })
        .map((balances) => {
          const paymentTokens = new Array<PaymentTokenOption>();
          for (const assetBalance of balances.assets) {
            // TODO: Convert the asset address to a readable name!
            paymentTokens.push(new PaymentTokenOption(assetBalance.assetAddress, assetBalance.assetAddress));
          }

          this.paymentTokens(paymentTokens);
        })
        .mapErr(() => {
          // tslint:disable-next-line: no-console
          console.log("No balances.");
        });
    } else {
      const eth = new PaymentTokenOption("ETH", EthereumAddress("0x0000000000000000000000000000000000000000"));
      const test = new PaymentTokenOption("HyperToken", EthereumAddress("0x9FBDa871d559710256a2502A2517b794B482Db40"));
      this.paymentTokens([eth, test]);
    }
  }
}

ko.components.register("token-selector", {
  viewModel: TokenSelectorViewModel,
  template: html,
});
