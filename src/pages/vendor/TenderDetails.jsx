import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import API from '../../api/axiosInstance';

const TenderDetails = ({ tenderId, onBack }) => {
  const { user } = useSelector((state) => state.auth); 
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

      <div className="bg-gray-700 p-6 rounded border border-gray-600 mb-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-3 text-white">{tender.title}</h2>
        
        {/* CLIENT CONTACT INFO BOX */}
        <div className="mb-6 p-4 rounded bg-gray-800 border border-gray-600">
          <h4 className="text-indigo-400 font-bold mb-2 uppercase text-xs tracking-widest">Client Contact Info</h4>
          {tender.client_id?.email ? (
            <div className="text-gray-200 space-y-1">
               <p><span className="text-gray-500 font-medium">Name:</span> {tender.client_id.name}</p>
               <p><span className="text-gray-500 font-medium">Email:</span> {tender.client_id.email}</p>
               <p><span className="text-gray-500 font-medium">Company:</span> {tender.client_id.company_name}</p>
            </div>
          ) : (
            <div className="bg-yellow-900/20 p-3 rounded flex justify-between items-center border border-yellow-700/30">
              <span className="text-yellow-500 flex items-center gap-2">
                <span role="img" aria-label="locked">🔒</span> Contact info is locked.
              </span>
              {!user?.isPremium && (
                <span className="text-[10px] bg-yellow-600 text-white px-2 py-1 rounded font-bold">PREMIUM ONLY</span>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-300 mb-6 whitespace-pre-wrap">{tender.description}</p>
        <div className="flex items-center justify-between border-t border-gray-600 pt-4">
            <p className="text-sm text-red-400 font-bold">
            Deadline: {new Date(tender.deadline).toLocaleString()}
            </p>
            <span className="text-xs text-gray-500 italic">ID: {tender._id}</span>
        </div>
      </div>

      {/* PROPOSAL FORM SECTION */}
      <h3 className="text-xl font-bold mb-4 text-white">Submit a Proposal</h3>

      <form onSubmit={handleSubmitProposal} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-gray-400 mb-1 text-sm font-medium">Bid Amount ($)</label>
          <input
            required
            type="number"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500 transition"
            placeholder="e.g. 500"
            value={proposalData.amount}
            onChange={(e) => setProposalData({ ...proposalData, amount: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1 text-sm font-medium">Cover Letter / Proposal Details</label>
          <textarea
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500 h-40 transition"
            placeholder="Explain why you are the best fit for this project..."
            value={proposalData.cover_letter}
            onChange={(e) => setProposalData({ ...proposalData, cover_letter: e.target.value })}
          />
        </div>
        <button
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {submitting ? 'Submitting Proposal...' : 'Submit Proposal'}
        </button>
      </form>
    </div>
  );
};

export default TenderDetails;