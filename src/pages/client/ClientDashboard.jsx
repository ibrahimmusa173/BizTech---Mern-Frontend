import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../store/authSlice';
import API from '../../api/axiosInstance';
import Notifications from '../../components/Notifications';

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('tenders');
  const [tenders, setTenders] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);
  
  // Trigger for re-fetching data
  const [refreshKey, setRefreshKey] = useState(0);

  // Forms states
  const [tenderForm, setTenderForm] = useState({ title: '', description: '', deadline: '' });
  const [newDeadline, setNewDeadline] = useState('');
  const [updatingDeadlineId, setUpdatingDeadlineId] = useState(null);

  // 1. Fetch logic is now cleanly inside the useEffect
  useEffect(() => {
    if (activeTab === 'tenders') {
      const fetchMyTenders = async () => {
        try {
          const { data } = await API.get('/tenders/client');
          setTenders(data);
        } catch (error) {
          console.error('Failed to fetch tenders', error);
        }
      };
      
      fetchMyTenders();
    }
  }, [activeTab, refreshKey]); // Runs whenever tab changes OR refreshKey updates

  const handleCreateTender = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tenders', tenderForm);
      alert('Tender created successfully!');
      setTenderForm({ title: '', description: '', deadline: '' });
      setActiveTab('tenders');
      setRefreshKey(prev => prev + 1); // Trigger fetch
    } catch {
      alert('Failed to create tender');
    }
  };

  const handleCloseTender = async (id) => {
    try {
      await API.put(`/tenders/${id}/close`);
      setRefreshKey(prev => prev + 1); // Trigger fetch
    } catch {
      alert('Failed to close tender');
    }
  };

  const handleUpdateDeadline = async (id) => {
    try {
      await API.put(`/tenders/${id}/deadline`, { deadline: newDeadline });
      setUpdatingDeadlineId(null);
      setNewDeadline('');
      setRefreshKey(prev => prev + 1); // Trigger fetch
    } catch {
      alert('Failed to update deadline');
    }
  };

  const fetchProposals = async (tenderId) => {
    try {
      const { data } = await API.get(`/tenders/${tenderId}/proposals`);
      setProposals(data);
      setSelectedTender(selectedTender === tenderId ? null : tenderId); 
    } catch {
      alert('Failed to fetch proposals');
    }
  };

  const handleProposalStatus = async (proposalId, status) => {
    try {
      await API.put(`/proposals/${proposalId}/status`, { status });
      fetchProposals(selectedTender); // Refresh the proposals for the currently opened tender
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
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
            onClick={() => setActiveTab('tenders')}
            className={`px-4 py-2 rounded font-semibold transition ${activeTab === 'tenders' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            My Tenders
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded font-semibold transition ${activeTab === 'create' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Create New Tender
          </button>
        </div>

        {activeTab === 'create' && (
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Create a New Job/Tender</h2>
            <form onSubmit={handleCreateTender} className="space-y-4 max-w-lg">
              <input 
                type="text" 
                placeholder="Tender Title" 
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500 text-white"
                value={tenderForm.title}
                onChange={e => setTenderForm({...tenderForm, title: e.target.value})}
                required
              />
              <textarea 
                placeholder="Job Description..." 
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500 h-32 text-white"
                value={tenderForm.description}
                onChange={e => setTenderForm({...tenderForm, description: e.target.value})}
                required
              />
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Deadline</label>
                <input 
                  type="date" 
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500 text-white"
                  value={tenderForm.deadline}
                  onChange={e => setTenderForm({...tenderForm, deadline: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded font-bold w-full transition">
                Publish Tender
              </button>
            </form>
          </div>
        )}

        {activeTab === 'tenders' && (
          <div className="space-y-6">
            {tenders.length === 0 ? <p className="text-gray-400">You haven't created any tenders yet.</p> : tenders.map(tender => (
              <div key={tender._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-indigo-400">{tender.title}</h3>
                    <p className="text-gray-300 mt-2">{tender.description}</p>
                    <div className="flex gap-4 mt-3">
                      <p className="text-sm text-gray-500">Deadline: <span className="text-white">{new Date(tender.deadline).toLocaleDateString()}</span></p>
                      <p className="text-sm text-gray-500">Status: <span className={`font-semibold uppercase ${tender.status === 'open' ? 'text-green-400' : 'text-red-400'}`}>{tender.status}</span></p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => fetchProposals(tender._id)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold transition">
                      {selectedTender === tender._id ? 'Hide Proposals' : 'View Proposals'}
                    </button>
                    {tender.status !== 'closed' && (
                      <>
                        <button onClick={() => setUpdatingDeadlineId(tender._id)} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm font-semibold transition">
                          Update Deadline
                        </button>
                        <button onClick={() => handleCloseTender(tender._id)} className="bg-gray-600 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold transition">
                          Close Tender
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {updatingDeadlineId === tender._id && (
                  <div className="mt-4 bg-gray-700 p-4 rounded-lg flex items-center gap-3">
                    <input 
                      type="date" 
                      className="p-2 rounded bg-gray-600 border border-gray-500 text-white focus:outline-none"
                      value={newDeadline}
                      onChange={e => setNewDeadline(e.target.value)}
                    />
                    <button onClick={() => handleUpdateDeadline(tender._id)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-semibold transition">Save</button>
                    <button onClick={() => setUpdatingDeadlineId(null)} className="text-gray-400 hover:text-white text-sm">Cancel</button>
                  </div>
                )}

                {selectedTender === tender._id && (
                  <div className="mt-6 border-t border-gray-700 pt-6">
                    <h4 className="text-lg font-bold mb-4 text-white">Received Proposals</h4>
                    {proposals.length === 0 ? <p className="text-gray-400 text-sm">No proposals submitted yet.</p> : (
                      <div className="space-y-4">
                        {proposals.map(proposal => (
                          <div key={proposal._id} className="bg-gray-700 p-5 rounded-lg border border-gray-600 flex justify-between items-center gap-4">
                            <div>
                              <p className="font-bold text-white mb-1">{proposal.vendorId?.name || 'Vendor'}</p>
                              <p className="text-gray-300 text-sm italic">"{proposal.cover_letter}"</p>
                              <div className="flex gap-4 mt-2 text-sm">
                                <p className="text-indigo-300 font-bold">Offer: ${proposal.price}</p>
                                <p className="text-gray-400">Status: <span className="uppercase font-semibold text-white">{proposal.status}</span></p>
                              </div>
                            </div>
                            
                            {proposal.status === 'pending' && tender.status !== 'closed' && (
                              <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleProposalStatus(proposal._id, 'accepted')} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-semibold transition">Accept</button>
                                <button onClick={() => handleProposalStatus(proposal._id, 'rejected')} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold transition">Reject</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;