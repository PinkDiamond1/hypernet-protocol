import { Box, Grid } from "@material-ui/core";
import React, { useEffect } from "react";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const Summary: React.FC = () => {
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderBalancesWidget({
        selector: "balances-wrapper",
        includeBoxWrapper: true,
      })
      .mapErr(handleError);

    hypernetWebIntegration.webUIClient
      .renderMerchantsWidget({
        selector: "merchant-list-wrapper",
        includeBoxWrapper: true,
      })
      .mapErr(handleError);

    hypernetWebIntegration.webUIClient
      .renderLinksWidget({
        selector: "payments-wrapper",
        includeBoxWrapper: true,
      })
      .mapErr(handleError);

    hypernetWebIntegration.webUIClient
      .renderPublicIdentifierWidget({
        selector: "public-identifier",
        includeBoxWrapper: true,
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="SUMMARY">
      <Grid container spacing={3}>
        <Grid item xs={12} spacing={3}>
          <Box id="public-identifier"></Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Box id="payments-wrapper"></Box>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} spacing={3}>
              <Box id="balances-wrapper"></Box>
            </Grid>
            <Grid item xs={12} spacing={3}>
              <Box id="merchant-list-wrapper"></Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default Summary;
