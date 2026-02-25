import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const { data } = await API.get('/proposals/vendor');
        setProposals(data);
      } catch (error) {
        console.error('Failed to fetch proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Submitted Proposals</h2>

      {loading ? (
        <p className="text-gray-400">Loading proposals...</p>
      ) : proposals.length === 0 ? (
        <p className="text-gray-400">
          You haven't submitted any proposals yet.
        </p>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="bg-gray-700 p-5 rounded border border-gray-600"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {proposal.tender?.title || 'Tender'}
                  </h3>
                  <p className="text-sm text-green-400 mt-1">
                    Bid Amount: $
                    {proposal.bid_amount || proposal.amount}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded font-bold ${
                    proposal.status === 'accepted'
                      ? 'bg-green-500/20 text-green-400'
                      : proposal.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {proposal.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>

              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-300 whitespace-pre-wrap text-sm">
                  {proposal.cover_letter || proposal.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProposals;