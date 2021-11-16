import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { Box } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
} from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/RenounceRoleWidget/RenounceRoleWidget.style";

interface IValues {
  accountAddress: EthereumAccountAddress;
}
interface IRenounceRoleWidget {
  onCloseCallback: () => void;
  registrarName: string;
}

const RenounceRoleWidget: React.FC<IRenounceRoleWidget> = ({
  onCloseCallback,
  registrarName,
}: IRenounceRoleWidget) => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
  );

  const handleFormSubmit = (values: IValues) => {
    setLoading(true);
    coreProxy
      .renounceRegistrarRole(registrarName, values.accountAddress)
      .map(() => {
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  return (
    <GovernanceDialog
      title="Renounce Rgistrar"
      description="Enter the address you want to renounce the registar role for."
      isOpen={true}
      onClose={onCloseCallback}
      content={
        <Box className={classes.wrapper}>
          <Formik
            enableReinitialize
            initialValues={
              {
                accountAddress: accountAddress,
              } as IValues
            }
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit, values }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <GovernanceField
                    name="accountAddress"
                    label="Renounce Address"
                    fullWidth
                    variant="outlined"
                    onChange={(event) =>
                      setAccountAddress(
                        EthereumAccountAddress(event.target.value),
                      )
                    }
                  />
                  <GovernanceButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!values.accountAddress}
                  >
                    Renounce
                  </GovernanceButton>
                </Form>
              );
            }}
          </Formik>
        </Box>
      }
    />
  );
};

export default RenounceRoleWidget;
