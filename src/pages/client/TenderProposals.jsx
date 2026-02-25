import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';

const TenderProposals = ({ tenderId, onBack }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await API.get(`/tenders/${tenderId}/proposals`);
        
        // FIX: Safe extraction of array data
        const data = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);
          
        setProposals(data);
      } catch (error) {
        console.error('Failed to fetch proposals:', error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    if (tenderId) {
      fetchProposals();
    }
  }, [tenderId]);

  const handleStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this proposal?`)) return;

    try {
      await API.put(`/proposals/${id}/status`, { status });

      // Update UI locally instead of refetching
      setProposals((prev) =>
        prev.map((proposal) =>
          proposal._id === id ? { ...proposal, status } : proposal
        )
      );
    } catch (error) {
      console.error('Failed to update proposal status:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-2 transition font-medium"
      >
        <span>←</span> Back to Tenders
      </button>

      <h2 className="text-2xl font-bold mb-6 text-white">
        Submitted Proposals
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400 animate-pulse">Loading proposals...</p>
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center p-10 bg-gray-800 rounded border border-gray-700">
          <p className="text-gray-400">
            No proposals submitted for this tender yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((prop) => (
            <div
              key={prop._id}
              className="bg-gray-700 p-5 rounded border border-gray-600 shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg text-white">
                    {prop.vendor?.company_name ||
                      prop.vendor?.name ||
                      'Unknown Vendor'}
                  </h4>

                  <p className="text-sm text-green-400 font-medium mt-1">
                    Bid Amount: ${prop.bid_amount || prop.amount}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded font-bold uppercase tracking-wider ${
                    prop.status === 'accepted'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : prop.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  {prop.status || 'PENDING'}
                </span>
              </div>

              <div className="bg-gray-800 p-4 rounded mb-4 border border-gray-700">
                <p className="text-gray-300 whitespace-pre-wrap text-sm font-mono">
                  {prop.cover_letter || prop.details}
                </p>
              </div>

              {/* Show Actions only if status is pending */}
              {(!prop.status || prop.status === 'pending') && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleStatus(prop._id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-sm transition font-bold text-white shadow-md hover:shadow-lg hover:shadow-green-500/20"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleStatus(prop._id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-sm transition font-bold text-white shadow-md hover:shadow-lg hover:shadow-red-500/20"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenderProposals;