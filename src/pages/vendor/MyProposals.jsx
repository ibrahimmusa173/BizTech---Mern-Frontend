import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await API.get('/proposals/vendor');

        console.log("BACKEND RESPONSE (My Proposals):", response.data);

        // ULTRA-ROBUST EXTRACTION
        let extractedData = [];
        if (Array.isArray(response.data)) {
          extractedData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          extractedData = response.data.data;
        } else if (response.data && Array.isArray(response.data.proposals)) {
          extractedData = response.data.proposals;
        }

        setProposals(extractedData);
      } catch (error) {
        console.error('Failed to fetch proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) {
    return <div className="text-gray-400 p-6 text-center">Loading your proposals...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8 text-white">My Submitted Proposals</h2>

      {proposals.length === 0 ? (
        <div className="bg-gray-800 p-10 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-500 italic">You haven't submitted any proposals yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((proposal) => (
            <div 
              key={proposal._id} 
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {/* Correct Key: Accessing the title from the populated tender_id */}
                  <h3 className="text-xl font-bold text-indigo-400">
                    {proposal.tender_id?.title || 'Unknown Tender'}
                  </h3>
                  
                  {/* Status Badge */}
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    proposal.status === 'accepted' ? 'bg-emerald-900/50 text-emerald-400' :
                    proposal.status === 'rejected' ? 'bg-red-900/50 text-red-400' :
                    'bg-amber-900/50 text-amber-400'
                  }`}>
                    {proposal.status || 'Pending'}
                  </span>
                </div>

                {/* Correct Key: Using 'amount' from your schema */}
                <p className="text-2xl font-bold text-white mb-4">
                  ${proposal.amount ? proposal.amount.toLocaleString() : '0.00'}
                </p>

                {/* Correct Key: Using 'cover_letter' from your schema */}
                <div className="text-gray-400 text-sm leading-relaxed mb-6">
                  <p className="text-gray-500 font-semibold mb-1 uppercase text-[10px] tracking-widest">Proposal Details:</p>
                  <p className="whitespace-pre-wrap">
                    {proposal.cover_letter || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700 flex justify-between items-center text-[11px] text-gray-500">
                <span>Submitted on: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                <span>ID: #{proposal._id.slice(-6)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProposals;