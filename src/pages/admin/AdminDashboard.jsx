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
  const [tenders, setTenders] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [users, setUsers] = useState([]); // New state for users
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/login');
  };

  // --- FETCH TENDERS ---
  const fetchTenders = async () => {
    setLoading(true);
    try {
      const response = await API.get('/admin/tenders');
      const data = response.data?.data || response.data?.tenders || response.data;
      setTenders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      setTenders([]);
    } finally {
      setLoading(false);
    }
  };

  // --- FETCH PROPOSALS ---
  const fetchProposals = async () => {
    setLoading(true);
    try {
      const response = await API.get('/admin/proposals');
      const data = response.data?.data || response.data?.proposals || response.data;
      setProposals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: FETCH USERS ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/admin/users');
      const data = response.data?.data || response.data?.users || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
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

  // --- NEW: BLOCK USER LOGIC ---
  const handleBlockUser = async (userId) => {
    if (!window.confirm("Are you sure you want to block this user?")) return;
    try {
      // Assuming patch/put based on your endpoint structure
      await API.put(`/admin/users/${userId}/block`);
      alert('User blocked successfully!');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user. Check if the route exists.');
    }
  };

  useEffect(() => {
    if (activeTab === 'tenders') fetchTenders();
    else if (activeTab === 'proposals') fetchProposals();
    else if (activeTab === 'users') fetchUsers();
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

        {/* Tab Navigation updated with "Manage Users" */}
        <div className="flex border-b border-gray-700 overflow-x-auto">
          <button onClick={() => setActiveTab('tenders')} className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${activeTab === 'tenders' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
            Manage Tenders
          </button>
          <button onClick={() => setActiveTab('proposals')} className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${activeTab === 'proposals' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
            View All Proposals
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${activeTab === 'users' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
            Manage Users
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 min-h-[400px]">
          {loading ? (
            <p className="text-gray-400">Loading data...</p>
          ) : activeTab === 'tenders' ? (
            /* Tenders Table */
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
                </tbody>
              </table>
            </div>
          ) : activeTab === 'proposals' ? (
            /* Proposals Table */
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
                </tbody>
              </table>
            </div>
          ) : (
            /* NEW: Users Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {Array.isArray(users) && users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-750 transition">
                      <td className="py-4 font-medium">{user.name}</td>
                      <td className="py-4 text-gray-300">{user.email}</td>
                      <td className="py-4 uppercase text-xs text-indigo-300 font-bold">{user.role || user.user_type}</td>
                      <td className="py-4 text-right">
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleBlockUser(user._id)} 
                            className="bg-red-900/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-700 text-xs px-3 py-1.5 rounded transition"
                          >
                            Block User
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
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