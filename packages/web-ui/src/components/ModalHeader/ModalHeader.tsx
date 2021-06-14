import { Box } from "@material-ui/core";
import { HYPER_TOKEN_LOGO_URL } from "@web-ui/constants";
import React from "react";

import { useStyles } from "./ModalHeader.style";

export const ModalHeader: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box className={classes.imageContainer}>
          <img width="40" src={HYPER_TOKEN_LOGO_URL} />
          <Box className={classes.connectorName}>Hypernet</Box>
        </Box>
      </Box>
    </Box>
  );
};
