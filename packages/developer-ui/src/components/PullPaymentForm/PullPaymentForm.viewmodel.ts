import {
  BigNumberString,
  EthereumAddress,
  PublicIdentifier,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { utils } from "ethers";
import ko from "knockout";
import moment from "moment";

import { AuthorizedGatewaySelectorParams } from "../AuthorizedGatewaySelector/AuthorizedGatewaySelector.viewmodel";
import { ButtonParams, EButtonType } from "../Button/Button.viewmodel";
import { TokenSelectorParams } from "../TokenSelector/TokenSelector.viewmodel";

import html from "./PullPaymentForm.template.html";

export class PullPaymentFormParams {
  constructor(
    public integration: IHypernetWebIntegration,
    public counterparty:
      | ko.Observable<PublicIdentifier>
      | ko.Computed<PublicIdentifier>,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentTokenOption {
  constructor(public tokenName: string, public address: EthereumAddress) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PullPaymentFormViewModel {
  public requiredStake: ko.Observable<string>;
  public expirationDate: ko.Observable<string>;
  public amount: ko.Observable<string>;
  public deltaAmount: ko.Observable<string>;
  public deltaTime: ko.Observable<string>;
  public tokenSelector: TokenSelectorParams;
  public gatewaySelector: AuthorizedGatewaySelectorParams;

  public submitButton: ButtonParams;

  protected integration: IHypernetWebIntegration;
  protected counterparty:
    | ko.Observable<PublicIdentifier>
    | ko.Computed<PublicIdentifier>;

  constructor(params: PullPaymentFormParams) {
    this.integration = params.integration;
    this.counterparty = params.counterparty;

    this.requiredStake = ko.observable("0");
    this.expirationDate = ko.observable(moment().format());
    this.amount = ko.observable("0");
    this.deltaAmount = ko.observable("0");
    this.deltaTime = ko.observable("0");

    this.tokenSelector = new TokenSelectorParams(
      this.integration,
      ko.observable(null),
      true,
    );
    this.gatewaySelector = new AuthorizedGatewaySelectorParams(
      this.integration,
      ko.observable(null),
    );

    this.submitButton = new ButtonParams(
      "Submit Payment",
      async () => {
        const selectedPaymentTokenAddress = this.tokenSelector.selectedToken();

        if (selectedPaymentTokenAddress == null) {
          return null;
        }

        const selectedGatewayUrl = this.gatewaySelector.selectedAuthorizedGateway();

        if (selectedGatewayUrl == null) {
          return null;
        }

        try {
          const expirationDate = UnixTimestamp(
            moment(this.expirationDate()).unix(),
          );
          const amount = BigNumberString(
            utils.parseUnits(this.amount(), "wei").toString(),
          );
          const requiredStake = BigNumberString(
            utils.parseUnits(this.requiredStake(), "wei").toString(),
          );
          const deltaAmount = BigNumberString(
            utils.parseUnits(this.deltaAmount(), "wei").toString(),
          );
          const deltaTime = Number(this.deltaTime());

          return await this.integration.core.authorizeFunds(
            this.counterparty(),
            amount,
            expirationDate,
            deltaAmount,
            deltaTime,
            requiredStake,
            selectedPaymentTokenAddress,
            selectedGatewayUrl,
            null,
          );
        } catch {
          return null;
        }
      },
      EButtonType.Normal,
      ko.pureComputed(() => {
        const selectedPaymentTokenAddress = this.tokenSelector.selectedToken();

        if (selectedPaymentTokenAddress == null) {
          return false;
        }

        try {
          moment(this.expirationDate());
          utils.parseUnits(this.amount(), "wei");
          utils.parseUnits(this.requiredStake(), "wei");
          utils.parseUnits(this.deltaAmount(), "wei");
          Number(this.deltaTime());

          return true;
        } catch {
          return false;
        }
      }),
    );
  }
}

ko.components.register("pull-payment-form", {
  viewModel: PullPaymentFormViewModel,
  template: html,
});
