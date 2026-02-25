import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import TenderProposals from './TenderProposals';

const MyTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [selectedTenderId, setSelectedTenderId] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await API.get('/tenders/client');
        
        // FIX: Safe extraction of array data
        const data = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);

        setTenders(data);
      } catch (error) {
        console.error('Failed to fetch tenders:', error);
        setTenders([]); // Ensure state remains an array
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  const handleClose = async (id) => {
    if (!window.confirm("Are you sure you want to close this tender?")) return;

    try {
      await API.put(`/tenders/${id}/close`);

      // Update state locally instead of refetching
      setTenders((prev) =>
        prev.map((tender) =>
          tender._id === id ? { ...tender, status: 'closed' } : tender
        )
      );
    } catch (error) {
      console.error('Failed to close tender:', error);
      alert('Failed to close tender');
    }
  };

  const handleUpdateDeadline = async (id) => {
    const newDate = prompt("Enter new deadline (Format: YYYY-MM-DDTHH:mm):");
    if (!newDate) return;

    try {
      await API.put(`/tenders/${id}/deadline`, { deadline: newDate });

      // Update state locally instead of refetching
      setTenders((prev) =>
        prev.map((tender) =>
          tender._id === id ? { ...tender, deadline: newDate } : tender
        )
      );
    } catch (error) {
      console.error('Failed to update deadline:', error);
      alert('Failed to update deadline');
    }
  };

  if (selectedTenderId) {
    return (
      <TenderProposals
        tenderId={selectedTenderId}
        onBack={() => setSelectedTenderId(null)}
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">My Posted Tenders</h2>

      {loading ? (
        <div className="flex items-center justify-center h-40">
           <p className="text-gray-400 animate-pulse">Loading tenders...</p>
        </div>
      ) : tenders.length === 0 ? (
        <div className="text-center p-10 bg-gray-800 rounded border border-gray-700">
          <p className="text-gray-400">You haven't created any tenders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tenders.map((tender) => (
            <div
              key={tender._id}
              className="bg-gray-700 p-5 rounded border border-gray-600 shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  {tender.title}
                </h3>

                <span
                  className={`px-3 py-1 text-xs rounded font-bold ${
                    tender.status === 'open'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {tender.status?.toUpperCase() || 'OPEN'}
                </span>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-2">
                {tender.description}
              </p>

              <p className="text-sm text-gray-400 mb-4 bg-gray-800 inline-block px-3 py-1 rounded">
                Deadline: {new Date(tender.deadline).toLocaleString()}
              </p>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-600/50">
                <button
                  onClick={() => setSelectedTenderId(tender._id)}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm transition font-medium text-white shadow"
                >
                  View Proposals
                </button>

                {tender.status !== 'closed' && (
                  <>
                    <button
                      onClick={() => handleUpdateDeadline(tender._id)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm transition font-medium text-white shadow"
                    >
                      Update Deadline
                    </button>

                    <button
                      onClick={() => handleClose(tender._id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition font-medium text-white shadow"
                    >
                      Close Tender
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTenders;