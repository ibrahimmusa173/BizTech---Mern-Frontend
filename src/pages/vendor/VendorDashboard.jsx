import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../store/authSlice';
import API from '../../api/axiosInstance';
import Notifications from '../../components/Notifications';

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('active-tenders'); 
  const [tenders, setTenders] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null); 
  
  // Trigger for re-fetching proposals
  const [refreshProposals, setRefreshProposals] = useState(0);

  const [proposalForm, setProposalForm] = useState({ cover_letter: '', price: '' });

  // 1. Tenders Effect
  useEffect(() => {
    if (activeTab === 'active-tenders') {
      const fetchActiveTenders = async () => {
        try {
          const { data } = await API.get('/tenders');
          setTenders(data);
        } catch (error) {
          console.error('Failed to fetch active tenders', error);
        }
      };
      fetchActiveTenders();
    }
  }, [activeTab]);

  // 2. Proposals Effect
  useEffect(() => {
    if (activeTab === 'my-proposals') {
      const fetchMyProposals = async () => {
        try {
          const { data } = await API.get('/proposals/vendor');
          setMyProposals(data);
        } catch (error) {
          console.error('Failed to fetch proposals', error);
        }
      };
      fetchMyProposals();
    }
  }, [activeTab, refreshProposals]); // Runs when tab changes OR refreshProposals increments

  const fetchTenderDetails = async (id) => {
    try {
      const { data } = await API.get(`/tenders/${id}`);
      setSelectedTender(data);
    } catch {
      alert('Failed to fetch tender details');
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    try {
      await API.post('/proposals', { ...proposalForm, tenderId: selectedTender._id });
      alert('Proposal submitted successfully!');
      setProposalForm({ cover_letter: '', price: '' });
      setSelectedTender(null); 
      setRefreshProposals(prev => prev + 1); // Refresh list in the background
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit proposal');
    }
  };

  const handleWithdrawProposal = async (id) => {
    if(!window.confirm("Are you sure you want to withdraw this proposal?")) return;
    try {
      await API.put(`/proposals/${id}/withdraw`);
      setRefreshProposals(prev => prev + 1); // Trigger refresh
    } catch {
      alert('Failed to withdraw proposal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <button 
            onClick={() => dispatch(setLogout())}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
          >
            Logout
          </button>
        </div>

        <Notifications />

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => { setActiveTab('active-tenders'); setSelectedTender(null); }}
            className={`px-4 py-2 rounded font-semibold transition ${activeTab === 'active-tenders' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Open Tenders
          </button>
          <button 
            onClick={() => { setActiveTab('my-proposals'); setSelectedTender(null); }}
            className={`px-4 py-2 rounded font-semibold transition ${activeTab === 'my-proposals' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            My Submitted Proposals
          </button>
        </div>

        {activeTab === 'active-tenders' && !selectedTender && (
          <div className="space-y-4">
            {tenders.length === 0 ? <p className="text-gray-400">No active tenders available right now.</p> : tenders.map(tender => (
              <div key={tender._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
                <div className="w-full">
                  <h3 className="text-xl font-bold text-indigo-400">{tender.title}</h3>
                  <p className="text-gray-400 truncate mt-1 text-sm">{tender.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Deadline: <span className="text-white">{new Date(tender.deadline).toLocaleDateString()}</span></p>
                </div>
                <button 
                  onClick={() => fetchTenderDetails(tender._id)}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded font-semibold transition shrink-0 w-full md:w-auto"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'active-tenders' && selectedTender && (
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
            <button onClick={() => setSelectedTender(null)} className="text-sm text-gray-400 hover:text-white mb-6 font-semibold flex items-center gap-1">
              <span>←</span> Back to Tenders
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-2">{selectedTender.title}</h2>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-6">
              <p className="text-gray-300 whitespace-pre-line">{selectedTender.description}</p>
            </div>
            <p className="text-sm text-gray-400 mb-8 font-semibold">
              Submissions close on: <span className="text-red-400">{new Date(selectedTender.deadline).toLocaleDateString()}</span>
            </p>
            
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-bold mb-4">Submit Your Proposal</h3>
              <form onSubmit={handleSubmitProposal} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Cover Letter</label>
                  <textarea 
                    className="w-full p-4 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-indigo-500 h-40 text-white"
                    placeholder="Describe why you are the best fit for this job..."
                    value={proposalForm.cover_letter}
                    onChange={e => setProposalForm({...proposalForm, cover_letter: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Your Bid / Proposed Price ($)</label>
                  <input 
                    type="number" 
                    className="w-full p-4 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-indigo-500 text-white max-w-xs"
                    placeholder="e.g. 500"
                    value={proposalForm.price}
                    onChange={e => setProposalForm({...proposalForm, price: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded font-bold transition mt-4 w-full md:w-auto shadow-lg">
                  Submit Proposal
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'my-proposals' && (
          <div className="space-y-4">
            {myProposals.length === 0 ? <p className="text-gray-400">You haven't submitted any proposals yet.</p> : myProposals.map(proposal => (
              <div key={proposal._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-start gap-4 shadow-lg">
                <div className="w-full">
                  <h3 className="text-lg font-bold text-indigo-400 mb-2">Tender: {proposal.tenderId?.title || 'Unknown Tender'}</h3>
                  <div className="bg-gray-900 p-3 rounded text-sm text-gray-300 italic mb-3 border border-gray-700">
                    "{proposal.cover_letter}"
                  </div>
                  <div className="flex gap-6 text-sm">
                    <p className="text-gray-400">Your Bid: <span className="text-white font-bold">${proposal.price}</span></p>
                    <p className="text-gray-400">Status: <span className="text-white font-bold uppercase">{proposal.status}</span></p>
                  </div>
                </div>
                
                {(proposal.status === 'pending' || proposal.status === 'submitted') && (
                  <button 
                    onClick={() => handleWithdrawProposal(proposal._id)}
                    className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-600/50 px-4 py-2 rounded transition text-sm font-semibold shrink-0"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;