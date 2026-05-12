import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout } from '../../store/authSlice';
import UserProfileCard from '../../components/UserProfileCard';
import API from '../../api/axiosInstance';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tenders');
  const [tenders, setTenders] = useState([]); // Default to empty array
  const [proposals, setProposals] = useState([]); // Default to empty array
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/login');
  };

  // --- FIXED FETCH TENDERS ---
  const fetchTenders = async () => {
    setLoading(true);
    try {
      const response = await API.get('/admin/tenders');
      console.log("Tenders API Response:", response.data); // Look at your console to see the structure!
      
      // We check multiple common nesting patterns and force an array fallback
      const data = response.data?.data || response.data?.tenders || response.data;
      setTenders(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error('Error fetching tenders:', error);
      setTenders([]); // Ensure it stays an array on error
    } finally {
      setLoading(false);
    }
  };

  // --- FIXED FETCH PROPOSALS ---
  const fetchProposals = async () => {
    setLoading(true);
    try {
      const response = await API.get('/admin/proposals');
      console.log("Proposals API Response:", response.data);

      const data = response.data?.data || response.data?.proposals || response.data;
      setProposals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTender = async (tenderId) => {
    try {
      await API.put(`/admin/tenders/${tenderId}/status`, { status: 'active' });
      alert('Tender approved successfully!');
      fetchTenders(); 
    } catch (error) {
      console.error('Error approving tender:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'tenders') fetchTenders();
    else fetchProposals();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-400">Admin Control Panel</h1>
        <button onClick={handleLogout} className="bg-red-600/90 hover:bg-red-600 px-5 py-2.5 rounded-lg text-white font-medium transition shadow-lg">
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        <UserProfileCard />

        <div className="flex border-b border-gray-700">
          <button onClick={() => setActiveTab('tenders')} className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'tenders' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
            Manage Tenders
          </button>
          <button onClick={() => setActiveTab('proposals')} className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'proposals' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
            View All Proposals
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 min-h-[400px]">
          {loading ? (
            <p className="text-gray-400">Loading data...</p>
          ) : activeTab === 'tenders' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {/* Defensive check: Use Array.isArray to prevent crash */}
                  {Array.isArray(tenders) && tenders.map((tender) => (
                    <tr key={tender._id} className="hover:bg-gray-750">
                      <td className="py-4 font-medium">{tender.title}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs uppercase ${tender.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                          {tender.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {tender.status !== 'active' && (
                          <button onClick={() => handleApproveTender(tender._id)} className="bg-indigo-600 hover:bg-indigo-700 text-xs px-3 py-1.5 rounded transition">
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!tenders || tenders.length === 0) && (
                    <tr><td colSpan="3" className="py-10 text-center text-gray-500">No tenders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="pb-3">Vendor</th>
                    <th className="pb-3">Proposal Cost</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {Array.isArray(proposals) && proposals.map((prop) => (
                    <tr key={prop._id}>
                      <td className="py-4">{prop.vendorId?.name || prop.vendorName || 'N/A'}</td>
                      <td className="py-4 text-emerald-400 font-bold">${prop.proposedAmount}</td>
                      <td className="py-4 uppercase text-xs">{prop.status}</td>
                    </tr>
                  ))}
                  {(!proposals || proposals.length === 0) && (
                    <tr><td colSpan="3" className="py-10 text-center text-gray-500">No proposals found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;