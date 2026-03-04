import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await API.get('/proposals/vendor');

        console.log("BACKEND RESPONSE (Proposals):", response.data);

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
  }, []); // ✅ FIXED HERE

  if (loading) {
    return <div>Loading proposals...</div>;
  }

  return (
    <div className="my-proposals">
      <h2>My Proposals</h2>

      {proposals.length === 0 ? (
        <p>No proposals found.</p>
      ) : (
        <div className="proposals-list">
          {proposals.map((proposal) => (
            <div key={proposal._id} className="proposal-card">
              <h3>{proposal.title || 'Untitled Proposal'}</h3>
              <p><strong>Status:</strong> {proposal.status || 'N/A'}</p>
              <p><strong>Budget:</strong> {proposal.budget || 'N/A'}</p>
              <p><strong>Description:</strong> {proposal.description || 'No description'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProposals;