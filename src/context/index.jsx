import React, { useContext, createContext } from 'react';

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    '0xe78b6EEfEB2Dd1a2525F72464Bf74f2f9Fb2999f'
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    'createCampaign'
  );

  const { mutateAsync: createProposal } = useContractWrite(
    contract,
    'createProposal'
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ]);
      console.log('contract call success', data);
    } catch (error) {
      console.log('contract call failure', error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', pId, {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  const createNewProposal = async (description) => {
    try {
      const data = await createProposal([description]);
      console.log('contract call success', data);
    } catch (error) {
      console.log('Failed to create proposal:', error);
    }
  };

  const getProposals = async () => {
    const proposals = await contract.call('getProposals');

    const parsedProposals = proposals.map((proposal, i) => ({
      description: proposal.description,
      votesFor: proposal.votesFor?.toNumber() || 0,
      votesAgainst: proposal.votesAgainst?.toNumber() || 0,
      voted: proposal.voted,
      pId: i,
      open: proposal.open,
    }));

    return parsedProposals;
  };

  const vote = async (pId, vote) => {
    try {
      const data = await contract.call('vote', pId, vote);
      console.log('contract call success', data);
    } catch (error) {
      console.log('Failed to vote:', error);
    }
  };

  const closeProposal = async (pId) => {
    try {
      const data = await contract.call('closeProposal', pId);
      window.location.reload();
      console.log('contract call success', data);
    } catch (error) {
      console.log('Failed to close proposal:', error);
      alert('Failed to close proposal, you might not be the creator!');
    }
  };

  const getProposalResult = async (pId) => {
    const result = await contract.call('getProposalResult', pId);
    return result;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        getProposals,
        createNewProposal,
        vote,
        closeProposal,
        getProposalResult,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
