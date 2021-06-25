import { Box } from "@material-ui/core";
import { useLayoutContext, useStoreContext } from "@web-ui/contexts";
import { IOnboardingFlowParams } from "@web-ui/interfaces";
import React, { useEffect, useState, ReactNode } from "react";
import { useAlert } from "react-alert";

import { ModalHeader, SucessContent, Button } from "@web-ui/components";
import { useStyles } from "@web-ui/flows/OnboardingFlow/OnboardingFlow.style";
import { useBalances } from "@web-ui/hooks";
import { EButtonStatus } from "@web-ui/theme";
import BalancesWidget from "@web-ui/widgets/BalancesWidget/BalancesWidget";
import FundWidget from "@web-ui/widgets/FundWidget/FundWidget";
import {
  AUTHENTICATION_IMAGE_URL,
  AUTHENTICATION_SUCCESS_IMAGE_URL,
} from "@web-ui/constants";

enum EOnboardingScreens {
  IDLE = 0,
  MERCHANT_AUTHORIZATION = 1,
  EMPTY_BALANCE = 2,
  FUND_WIDGET = 3,
  BALANCES = 4,
  ONBOARDING_SUCCESS = 5,
}

const OnboardingFlow: React.FC<IOnboardingFlowParams> = (
  props: IOnboardingFlowParams,
) => {
  const {
    merchantUrl,
    finalSuccessContent = "You are good to go and purchase using your payment token",
    closeCallback = () => {},
    merchantName,
  } = props;
  const alert = useAlert();
  const { balances } = useBalances();

  const { coreProxy } = useStoreContext();
  const { setLoading, closeModal } = useLayoutContext();
  const classes = useStyles();

  const [currentSreen, setCurrentSreen] = useState<EOnboardingScreens>(
    EOnboardingScreens.IDLE,
  );

  useEffect(() => {
    setLoading(true);
    // First initialze the merchant
    coreProxy.getAuthorizedMerchants().match((merchantsMap) => {
      if (merchantsMap.get(merchantUrl)) {
        //check for balances
        coreProxy.getBalances().match((_balances) => {
          decideScreenWhenMerchantIsAlreadyAuthorized(
            !!_balances.assets?.length,
          );
        }, handleError);
      } else {
        setCurrentSreen(EOnboardingScreens.MERCHANT_AUTHORIZATION);
      }

      setLoading(false);
      // Then get the preferred payment token if there is any
      /* coreProxy.getPreferredPaymentToken().map((token) => {
        setPreferredPaymentTokenByAssetInfo(token);
      }); */
    }, handleError);

    coreProxy.onMerchantAuthorized.subscribe((_merchantUrl) => {
      if (merchantUrl === _merchantUrl) {
        alert.success(`Merchant ${merchantUrl} authorization succeeded!`);
        setLoading(false);
        coreProxy.getBalances().match((_balances) => {
          decideScreenWhenMerchantIsAlreadyAuthorized(
            !!_balances.assets?.length,
          );
        }, handleError);
      }
    });

    coreProxy.onAuthorizedMerchantActivationFailed.subscribe((_merchantUrl) => {
      if (merchantUrl === _merchantUrl) {
        alert.error(`Merchant ${merchantUrl} authorization failed!`);
        setLoading(false);
      }
    });
  }, []);

  // Watch funding success
  useEffect(() => {
    if (balances?.length && currentSreen === EOnboardingScreens.FUND_WIDGET) {
      setCurrentSreen(EOnboardingScreens.BALANCES);
    }
  }, [balances]);

  const decideScreenWhenMerchantIsAlreadyAuthorized = (
    hasBalances?: boolean,
  ) => {
    if (hasBalances || balances?.length) {
      setCurrentSreen(EOnboardingScreens.BALANCES);
    } else {
      setCurrentSreen(EOnboardingScreens.EMPTY_BALANCE);
    }
  };

  const handleMerchantAuthorization = () => {
    setLoading(true);
    coreProxy.authorizeMerchant(merchantUrl).mapErr(handleError);
  };

  const goToFundWalletScreen = () => {
    setCurrentSreen(EOnboardingScreens.FUND_WIDGET);
  };

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const goToSuccessScreen = () => {
    setCurrentSreen(EOnboardingScreens.ONBOARDING_SUCCESS);
  };

  const renderFundWalletButton = (status?: EButtonStatus) => {
    if (status === EButtonStatus.secondary) {
      return (
        <Button
          label="Fund my wallet"
          onClick={goToFundWalletScreen}
          fullWidth={true}
          status={EButtonStatus.secondary}
        />
      );
    }
    return (
      <Button
        label="Fund my wallet"
        onClick={goToFundWalletScreen}
        fullWidth={true}
        bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
      />
    );
  };

  const onOkClick = () => {
    closeCallback();
    closeModal();
  };

  const renderScreen = (): ReactNode => {
    switch (currentSreen) {
      case EOnboardingScreens.IDLE:
        return <>Loading...</>;
      case EOnboardingScreens.MERCHANT_AUTHORIZATION:
        return (
          <>
            {balances?.length ? (
              <Box>
                <Box className={classes.balancesLabel}>Your Balances</Box>
                <BalancesWidget />
              </Box>
            ) : (
              <>
                <Box className={classes.balancesEmptyLabel}>
                  You are getting closer!
                </Box>
                <img
                  className={classes.authenticationImg}
                  src={AUTHENTICATION_IMAGE_URL}
                />
              </>
            )}
            <Button
              label={`Approve ${merchantName || "Hyperpay"}`}
              onClick={handleMerchantAuthorization}
              fullWidth={true}
              bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
            />
          </>
        );
      case EOnboardingScreens.EMPTY_BALANCE:
        return (
          <>
            <Box className={classes.balancesEmptyLabel}>
              You have successfully connected your wallet!
            </Box>
            <img
              className={classes.authenticationSuccessImg}
              src={AUTHENTICATION_SUCCESS_IMAGE_URL}
            />
            {renderFundWalletButton()}
          </>
        );
      case EOnboardingScreens.FUND_WIDGET:
        return <FundWidget />;
      case EOnboardingScreens.BALANCES:
        return (
          <>
            {balances?.length && <BalancesWidget />}

            <Box className={classes.doneButtonWrapper}>
              <Button
                label="Done"
                onClick={goToSuccessScreen}
                fullWidth={true}
                bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
              />
            </Box>

            {renderFundWalletButton(EButtonStatus.secondary)}
          </>
        );
      case EOnboardingScreens.ONBOARDING_SUCCESS:
        return (
          <>
            <SucessContent
              label="All good!"
              info={finalSuccessContent}
              onOkay={onOkClick}
            />
            {renderFundWalletButton(EButtonStatus.secondary)}
          </>
        );
      default:
        return <Box>Something went wrong!</Box>;
    }
  };

  return (
    <Box className={classes.container}>
      <ModalHeader />
      {renderScreen()}
      {/* <ModalFooter /> */}
    </Box>
  );
};

export default OnboardingFlow;
