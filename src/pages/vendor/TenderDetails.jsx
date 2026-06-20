import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';

const TenderDetails = ({ tenderId, onBack }) => {
  const [tender, setTender] = useState(null);
  const [proposalData, setProposalData] = useState({
    amount: '',
    cover_letter: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const response = await API.get(`/tenders/${tenderId}`);
        const data = response.data?.data || response.data?.tender || response.data;
        setTender(data);
      } catch (error) {
        console.error('Failed to fetch tender details:', error);
      }
    };
    fetchTender();
  }, [tenderId]);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/proposals', {
        tender_id: tenderId,
        amount: Number(proposalData.amount),
        cover_letter: proposalData.cover_letter,
      });
      alert('Proposal submitted successfully!');
      onBack();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (!tender) return <p className="text-gray-400">Loading tender details...</p>;

  return (
    <div>
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 mb-6 flex items-center transition">
        ← Back to Active Tenders
      </button>

      <div className="bg-gray-700 p-6 rounded border border-gray-600 mb-8">
        <h2 className="text-2xl font-bold mb-3 text-white">{tender.title}</h2>
        <p className="text-gray-300 mb-6 whitespace-pre-wrap">{tender.description}</p>
        <p className="text-sm text-red-400 font-bold">
          Deadline: {new Date(tender.deadline).toLocaleString()}
        </p>
      </div>

      <h3 className="text-xl font-bold mb-4 text-white">Submit a Proposal</h3>

      <form onSubmit={handleSubmitProposal} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-gray-400 mb-1">Bid Amount ($)</label>
          <input
            required
            type="number"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500"
            value={proposalData.amount}
            onChange={(e) => setProposalData({ ...proposalData, amount: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Cover Letter / Proposal Details</label>
          <textarea
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500 h-32"
            value={proposalData.cover_letter}
            onChange={(e) => setProposalData({ ...proposalData, cover_letter: e.target.value })}
          />
        </div>
        <button
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Proposal'}
        </button>
      </form>
    </div>
  );
};

export default TenderDetails;