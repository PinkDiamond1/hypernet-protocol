import ko from "knockout";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { EPaymentType } from "@hypernetlabs/objects/types";
import html from "./PaymentForm.template.html";
import { PushPaymentFormParams } from "../PushPaymentForm/PushPaymentForm.viewmodel";
import { PullPaymentFormParams } from "../PullPaymentForm/PullPaymentForm.viewmodel";

export class PaymentFormParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentTypeOption {
  constructor(public typeName: string, public type: EPaymentType) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentFormViewModel {
  public remoteAccount: ko.Observable<string>;
  public paymentTypes: PaymentTypeOption[];
  public selectedPaymentType: ko.Observable<PaymentTypeOption | null>;
  public showPushForm: ko.PureComputed<boolean>;
  public showPullForm: ko.PureComputed<boolean>;
  public pushPayment: PushPaymentFormParams;
  public pullPayment: PullPaymentFormParams;

  protected integration: IHypernetWebIntegration;

  constructor(params: PaymentFormParams) {
    this.integration = params.integration;

    this.remoteAccount = ko.observable("Enter public identifier");

    this.paymentTypes = [
      new PaymentTypeOption("Push", EPaymentType.Push),
      new PaymentTypeOption("Pull", EPaymentType.Pull),
    ];

    this.selectedPaymentType = ko.observable<PaymentTypeOption>(null);

    this.showPushForm = ko.pureComputed(() => {
      return this.selectedPaymentType()?.type === EPaymentType.Push;
    });

    this.showPullForm = ko.pureComputed(() => {
      return this.selectedPaymentType()?.type === EPaymentType.Pull;
    });

    this.pushPayment = new PushPaymentFormParams(this.integration, this.remoteAccount);
    this.pullPayment = new PullPaymentFormParams(this.integration, this.remoteAccount);
  }
}

ko.components.register("payment-form", {
  viewModel: PaymentFormViewModel,
  template: html,
});
