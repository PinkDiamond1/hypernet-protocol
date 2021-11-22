import React from "react";
import { Box } from "@material-ui/core";
import { GovernanceButton } from "@web-ui/components";
import { useStyles } from "./ModalFooter.style";

export const ModalFooter: React.FC = () => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <GovernanceButton
        variant="text"
        color="primary"
        fullWidth
        onClick={() => {
          document.open(
            "https://hypernet-protocol-dashboard-dev.hypernetlabs.io",
            "_blank",
          );
        }}
      >
        View your Hypernet Account.
      </GovernanceButton>
    </Box>
  );
};
