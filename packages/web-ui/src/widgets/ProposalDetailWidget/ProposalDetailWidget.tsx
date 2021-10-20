import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Grid } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceWidgetHeader,
  GovernanceVotingCard,
  GovernanceMarkdown,
  GovernanceStatusTag,
  IHeaderAction,
} from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/ProposalDetailWidget/ProposalDetailWidget.style";
import { IProposalDetailWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EProposalState,
  Proposal,
  EthereumAddress,
  EProposalVoteSupport,
} from "@hypernetlabs/objects";

const ProposalDetailWidget: React.FC<IProposalDetailWidgetParams> = ({
  onProposalListNavigate,
  proposalId,
}: IProposalDetailWidgetParams) => {
  const classes = useStyles();
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [proposal, setProposal] = useState<Proposal>();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>();
  const [supportStatus, setSupportStatus] = useState<EProposalVoteSupport>();

  useEffect(() => {
    getProposalDetail();
  }, []);

  const getProposalDetail = () => {
    setLoading(true);
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);

      // delegate votes, createProposal and then list all proposals
      coreProxy
        .getProposalDetails(proposalId)
        .map((proposal) => {
          setProposal(proposal);
        })
        .mapErr(handleError);

      getProposalVotesReceipt(accounts[0]);
    });
  };

  const getProposalVotesReceipt = (account: EthereumAddress) => {
    setLoading(true);

    coreProxy
      .getProposalVotesReceipt(proposalId, account)
      .map((proposalVoteReceipt) => {
        if (proposalVoteReceipt.hasVoted) {
          setSupportStatus(Number(proposalVoteReceipt.support));
        }

        setLoading(false);
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const proposalVotesFor = proposal ? proposal.votesFor : 0;

  const proposalVotesAgainst = proposal ? proposal.votesAgainst : 0;

  const proposalVotesAbstain = proposal ? proposal.votesAbstain : 0;

  const totalVotes =
    proposalVotesFor + proposalVotesAgainst + proposalVotesAbstain;

  const forPercentage =
    ((proposalVotesFor * 100) / totalVotes).toFixed(0) || "0";

  const againstPercentage =
    ((proposalVotesAgainst * 100) / totalVotes).toFixed(0) || "0";

  const abstainPercentage =
    ((proposalVotesAbstain * 100) / totalVotes).toFixed(0) || "0";

  const showVotingButtons = Number(proposal?.state) === EProposalState.ACTIVE;

  const queueProposal = () => {
    setLoading(true);
    coreProxy
      .queueProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
        setLoading(false);
      })
      .mapErr(handleError);
  };

  const cancelProposal = () => {
    setLoading(true);
    coreProxy
      .cancelProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
        setLoading(false);
      })
      .mapErr(handleError);
  };

  const executeProposal = () => {
    setLoading(true);
    coreProxy
      .executeProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
        setLoading(false);
      })
      .mapErr(handleError);
  };

  const castVote = (voteSupport: EProposalVoteSupport) => {
    setLoading(true);
    coreProxy
      .castVote(proposalId, voteSupport)
      .map((proposal) => {
        setProposal(proposal);

        if (accountAddress) {
          getProposalVotesReceipt(accountAddress);
        }
      })
      .mapErr(handleError);
  };

  const isUserProposalOwner =
    proposal &&
    accountAddress &&
    EthereumAddress(proposal.originator) === accountAddress;

  const getHeaderActions = useCallback(() => {
    return [
      ...(Number(proposal?.state) === EProposalState.SUCCEEDED
        ? [
            {
              label: "Queue Proposal",
              onClick: () => {
                queueProposal();
              },
              variant: "outlined",
            },
          ]
        : []),
      ...(Number(proposal?.state) === EProposalState.QUEUED
        ? [
            {
              label: "Execute Proposal",
              onClick: () => {
                executeProposal();
              },
              variant: "outlined",
            },
          ]
        : []),
      ...(isUserProposalOwner &&
      (Number(proposal?.state) === EProposalState.PENDING ||
        Number(proposal?.state) === EProposalState.QUEUED ||
        Number(proposal?.state) === EProposalState.ACTIVE ||
        Number(proposal?.state) === EProposalState.DEFEATED ||
        Number(proposal?.state) === EProposalState.EXPIRED)
        ? [
            {
              label: "Cancel Proposal",
              onClick: () => {
                cancelProposal();
              },
              variant: "outlined",
            },
          ]
        : []),
    ] as IHeaderAction[];
  }, [JSON.stringify(proposal)]);

  return (
    <Box>
      <GovernanceWidgetHeader
        label={"Proposal Detail"}
        navigationLink={{
          label: "Proposal List",
          onClick: () => {
            onProposalListNavigate?.();
          },
        }}
        headerActions={getHeaderActions()}
      />

      {proposal?.state != null && (
        <Box className={classes.proposalStatus}>
          <GovernanceStatusTag status={proposal?.state} />
        </Box>
      )}
      <Box display="flex">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <GovernanceVotingCard
              type="for"
              value={proposalVotesFor}
              progressValue={parseFloat(forPercentage)}
              onVoteClick={() => castVote(EProposalVoteSupport.FOR)}
              isVoted={supportStatus === EProposalVoteSupport.FOR}
              showVoteButton={showVotingButtons}
              disableVoteButton={
                Number(proposal?.state) !== EProposalState.ACTIVE
              }
            />
          </Grid>
          <Grid item xs={4}>
            <GovernanceVotingCard
              type="against"
              value={proposalVotesAgainst}
              progressValue={parseFloat(againstPercentage)}
              onVoteClick={() => castVote(EProposalVoteSupport.AGAINST)}
              isVoted={supportStatus === EProposalVoteSupport.AGAINST}
              showVoteButton={showVotingButtons}
              disableVoteButton={
                Number(proposal?.state) !== EProposalState.ACTIVE
              }
            />
          </Grid>
          <Grid item xs={4}>
            <GovernanceVotingCard
              type="abstain"
              value={proposalVotesAbstain}
              progressValue={parseFloat(abstainPercentage)}
              onVoteClick={() => castVote(EProposalVoteSupport.ABSTAIN)}
              isVoted={supportStatus === EProposalVoteSupport.ABSTAIN}
              showVoteButton={showVotingButtons}
              disableVoteButton={
                Number(proposal?.state) !== EProposalState.ACTIVE
              }
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.proposalDetails}>
        <Typography variant="h5" className={classes.proposalDetailsLabel}>
          Details:
        </Typography>
        <Box className={classes.proposerSectionWrapper}>
          <Typography variant="h5" className={classes.proposerLabel}>
            Proposer
          </Typography>
          <Typography variant="h5" className={classes.proposerValue}>
            {proposal?.originator}
          </Typography>
        </Box>
        <GovernanceMarkdown source={proposal?.description} />
      </Box>
    </Box>
  );
};

export default ProposalDetailWidget;
