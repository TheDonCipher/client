import { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { Loader } from '../components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  async function handleCreateProposal() {
    setIsLoading(true);
    await createNewProposal(description);
    setIsLoading(false);
    toast.success('Proposal created successfully');
    setDescription('');
  }

  async function handleVote() {
    setIsLoading(true);
    await vote(selectedProposalId, selectedVote);
    setSelectedVote('');
    setIsLoading(false);
    toast.success('Vote submitted successfully');
  }

  function handleSelectProposal(pId) {
    const selectedProposal = proposals.find((proposal) => proposal.pId === pId);
    setSelectedProposalId(pId);
    setDescription(selectedProposal.description);
  }

  async function handleCloseProposal(pId) {
    setIsLoading(true);
    await closeProposal(pId);
    setIsLoading(false);
    toast.success('Proposal closed successfully');
  }

  async function handleGetProposalResult(pId, description) {
    const result = await getProposalResult(pId);
    toast(
      `Proposal "${description}" - Yes: ${result[0]} No: ${result[1]} Abstain: ${result[2]}`
    );
  }

  return (
    <main class="flex flex-col md:flex-row items-start p-10 md:p-16 bg-gray-900 rounded-lg">
      {isLoading && <Loader />}
      <ToastContainer
        position="bottom-center"
        autoClose={6500}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
      />
      <div class="w-full md:w-1/2 lg:w-1/3 p-6 md:p-8 mb-6 md:mr-6 bg-gray-800 rounded-lg shadow-md">
        <h2 class="font-epilogue text-white text-2xl font-bold mb-4">
          Create a Proposal
        </h2>
        <div class="flex flex-col">
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
            onClick={handleCreateProposal}
          >
            Create Proposal
          </button>
        </div>
      </div>

      <section class="w-full md:w-1/2 lg:w-2/3 p-6 md:p-8 bg-gray-800 rounded-lg shadow-md">
        <div class="w-full order-1 mb-4">
          {selectedProposalId && (
            <div class="bg-[#1c1c24] shadow-md rounded px-8 pt-6 pb-8">
              <h2 class="font-epilogue text-[#808191] text-medium mb-4">
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
        <ul className="divide-y divide-gray-200">
          {proposals &&
            proposals.map((proposal) => (
              <article
                key={proposal.pId}
                className="bg-[#8c6dfd] rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out mb-6 p-6"
              >
                <h3 className="font-epilogue text-lg font-semibold text-gray-900 mb-2">
                  {proposal.description}
                </h3>

                {proposal.open ? (
                  <div className="flex justify-end">
                    <button
                      className="font-epilogue bg-transparent hover:outline-1 text-gray-900 font-bold py-2 px-4 rounded mr-4 outline outline-offset-2 outline-2"
                      onClick={() => {
                        handleSelectProposal(proposal.pId);
                        window.scrollTo(0, 0); // scroll to top
                      }}
                    >
                      Vote
                    </button>
                    <button
                      className="font-epilogue bg-transparent hover:outline-1 text-gray-900 font-bold py-2 px-4 rounded outline outline-offset-2 outline-2"
                      onClick={() => handleCloseProposal(proposal.pId)}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <button
                    className="font-epilogue bg-transparent hover:outline-1 text-gray-900 font-bold py-2 px-4 rounded outline outline-offset-2 outline-2"
                    onClick={() =>
                      handleGetProposalResult(
                        proposal.pId,
                        proposal.description
                      )
                    }
                  >
                    Show Results
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
