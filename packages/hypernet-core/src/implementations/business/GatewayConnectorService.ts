import {
  LogicalError,
  GatewayConnectorError,
  GatewayValidationError,
  BlockchainUnavailableError,
  ProxyError,
  PersistenceError,
  GatewayAuthorizationDeniedError,
  GatewayUrl,
  Signature,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils } from "@hypernetlabs/utils";
import { IGatewayConnectorService } from "@interfaces/business";
import {
  IAccountsRepository,
  IGatewayConnectorRepository,
} from "@interfaces/data";
import { okAsync, ResultAsync } from "neverthrow";

import { IContextProvider, IConfigProvider } from "@interfaces/utilities";

export class GatewayConnectorService implements IGatewayConnectorService {
  constructor(
    protected gatewayConnectorRepository: IGatewayConnectorRepository,
    protected accountsRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
    protected configProvider: IConfigProvider,
    protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, LogicalError | GatewayConnectorError> {
    return this.contextProvider.getContext().map((context) => {
      // Subscribe to the various events, and sort them out for the gateway connector
      context.onPushPaymentSent.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentSent(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentUpdated.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentUpdated(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentReceived.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentReceived(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentDelayed.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentDelayed(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentCanceled.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentCanceled(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentSent.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentSent(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentUpdated.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentUpdated(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentReceived.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentReceived(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentDelayed.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentDelayed(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentCanceled.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentCanceled(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onBalancesChanged.subscribe((balances) => {
        this.gatewayConnectorRepository
          .notifyBalancesReceived(balances)
          .mapErr((e) => {
            console.log(e);
          });
      });
    });
  }

  public authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayValidationError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getAuthorizedGateways(),
      this.accountsRepository.getBalances(),
    ]).andThen((vals) => {
      const [context, authorizedGatewaysMap, balances] = vals;

      let deauthResult: ResultAsync<
        void,
        PersistenceError | ProxyError | GatewayAuthorizationDeniedError
      >;
      // Remove the gateway iframe proxy related to that gatewayUrl if there is any activated ones.
      if (authorizedGatewaysMap.get(gatewayUrl)) {
        deauthResult =
          this.gatewayConnectorRepository.deauthorizeGateway(gatewayUrl);
      } else {
        deauthResult = okAsync(undefined);
      }

      return deauthResult
        .andThen(() => {
          return this.gatewayConnectorRepository.getGatewayRegistrationInfo([
            gatewayUrl,
          ]);
        })
        .andThen((gatewayRegistrationInfoMap) => {
          const gatewayRegistrationInfo =
            gatewayRegistrationInfoMap.get(gatewayUrl);
          if (gatewayRegistrationInfo == null) {
            throw new Error(
              "Gateway registration info not available but no error!",
            );
          }

          return this.gatewayConnectorRepository
            .addAuthorizedGateway(gatewayRegistrationInfo, balances)
            .map(() => {
              context.onGatewayAuthorized.next(gatewayUrl);
            });
        });
    });
  }

  public deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | GatewayAuthorizationDeniedError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      context.onGatewayDeauthorizationStarted.next(gatewayUrl);

      return this.gatewayConnectorRepository.deauthorizeGateway(gatewayUrl);
    });
  }

  public getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  > {
    return this.gatewayConnectorRepository.getAuthorizedGateways();
  }

  public getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
  > {
    return this.gatewayConnectorRepository.getAuthorizedGatewaysConnectorsStatus();
  }

  public activateAuthorizedGateways(): ResultAsync<
    void,
    | GatewayConnectorError
    | GatewayValidationError
    | BlockchainUnavailableError
    | LogicalError
    | ProxyError
  > {
    return this.accountsRepository.getBalances().andThen((balances) => {
      return this.gatewayConnectorRepository.activateAuthorizedGateways(
        balances,
      );
    });
  }

  public closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError> {
    return this.gatewayConnectorRepository.closeGatewayIFrame(gatewayUrl);
  }

  public displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError> {
    return this.gatewayConnectorRepository.displayGatewayIFrame(gatewayUrl);
  }
}
