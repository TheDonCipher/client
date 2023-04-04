import { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { Loader } from '../components';

function VotingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [selectedVote, setSelectedVote] = useState('');
  const {
    getProposals,
    createNewProposal,
    vote,
    closeProposal,
    getProposalResult,
    address,
    contract,
  } = useStateContext();

  const [proposals, setProposals] = useState([]);

  const fetchProposals = async () => {
    setIsLoading(true);
    const data = await getProposals();
    setProposals(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchProposals();
  }, [address, contract]);

  function handleCreateProposal() {
    createNewProposal(description);
    setDescription('');
  }

  async function handleVote() {
    setIsLoading(true);
    await vote(selectedProposalId, selectedVote);
    setSelectedVote('');
    setIsLoading(false);
  }

  function handleSelectProposal(pId) {
    const selectedProposal = proposals.find((proposal) => proposal.pId === pId);
    setSelectedProposalId(pId);
    setDescription(selectedProposal.description);
  }

  function handleCloseProposal(pId) {
    closeProposal(pId);
  }

  async function handleGetProposalResult(pId) {
    const result = await getProposalResult(pId);
    alert(`Yes: ${result[0]} No: ${result[1]} Abstain: ${result[2]}`);
  }

  return (
    <main class="flex flex-col md:flex-row items-start p-10 md:p-16 bg-gray-900 rounded-lg">
      {isLoading && <Loader />}
      <div class="w-full md:w-1/2 lg:w-1/3 p-6 md:p-8 mb-6 md:mr-6 bg-gray-800 rounded-lg shadow-md">
        <h2 class="font-epilogue text-white text-2xl font-bold mb-4">
          Create a Proposal
        </h2>
        <form class="flex flex-col" onSubmit={handleCreateProposal}>
          <label class="sr-only" for="proposal-description">
            Proposal Description
          </label>
          <input
            id="proposal-description"
            class="mb-4 py-3 px-4 outline-none border border-gray-600 bg-transparent font-epilogue text-white text-lg placeholder-gray-500 rounded-lg"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter proposal description"
          />
          <button
            class="font-epilogue bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg"
            type="submit"
          >
            Create Proposal
          </button>
        </form>
      </div>

      <section class="w-full md:w-1/2 lg:w-2/3 p-6 md:p-8 bg-gray-800 rounded-lg shadow-md">
        <div class="w-full order-1 mb-4">
          {selectedProposalId && (
            <div class="bg-white shadow-md rounded px-8 pt-6 pb-8">
              <h2 class="font-epilogue text-2xl font-bold mb-4">
                Vote on Proposal - {description}
              </h2>
              <select
                class="font-epilogue w-full border rounded py-2 px-3 mb-4"
                value={selectedVote}
                onChange={(e) => setSelectedVote(e.target.value)}
              >
                <option className="font-epilogue" value="">
                  Select Vote
                </option>
                <option value="yes">For</option>
                <option value="no">Against</option>
                <option value="abastain">Abstain</option>
              </select>

              <button
                class="font-epilogue bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleVote}
              >
                Submit Vote
              </button>
            </div>
          )}
        </div>

        <header class="mb-6">
          <h2 class="font-epilogue text-white text-2xl font-bold mb-4">
            Proposals
          </h2>
        </header>
        <ul>
          {proposals &&
            proposals.map((proposal) => (
              <article
                key={proposal.pId}
                class="mb-6 p-6 bg-gray-700 rounded-lg"
              >
                <h3 class="font-epilogue text-lg font-bold mb-2 text-white">
                  {proposal.description}
                </h3>
                {/* <p class="font-epilogue mb-2 text-white">
                  Yes Votes: {proposal.yesVotes}
                </p>
                <p class="font-epilogue mb-2 text-white">
                  No Votes: {proposal.noVotes}
                </p>
                <p class="font-epilogue mb-2 text-white">
                  Abstain Votes: {proposal.abstainVotes}
                </p> */}
                {proposal.open ? (
                  <div class="flex">
                    <button
                      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
                      onClick={() => {
                        handleSelectProposal(proposal.pId);
                        window.scrollTo(0, 0); // scroll to top
                      }}
                    >
                      Vote
                    </button>
                    <button
                      class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleCloseProposal(proposal.pId)}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <button
                    class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleGetProposalResult(proposal.pId)}
                  >
                    Result
                  </button>
                )}
              </article>
            ))}
        </ul>
      </section>
    </main>
  );
}

export default VotingPage;
