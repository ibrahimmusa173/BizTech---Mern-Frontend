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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- UPDATED: Stats State (totalProposals instead of totalVendors) ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTenders: 0,
    totalProposals: 0 
  });

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/login');
  };

  // --- UPDATED: Fetch Stats mapping ---
  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/stats');
      const data = response.data?.data || response.data;
      setStats({
        totalUsers: data.totalUsers || 0,
        totalTenders: data.totalTenders || 0,
        // Checks for totalProposals key from your backend
        totalProposals: data.totalProposals || data.totalVendors || 0 
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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

  // --- UPDATED: handleToggleTenderStatus ---
const handleToggleTenderStatus = async (tender) => {
  // Determine next status based on current status
  const newStatus = tender.status === 'active' ? 'rejected' : 'active';
  const actionText = newStatus === 'active' ? 'approve' : 'reject';

  if (!window.confirm(`Are you sure you want to ${actionText} this tender?`)) return;

  try {
    const response = await API.put(`/admin/tenders/${tender._id}/status`, { status: newStatus });
    alert(response.data.message);
    fetchTenders();
    fetchStats(); 
  } catch (error) {
    console.error('Error updating tender status:', error);
    alert("Failed to update status.");
  }
};

  // --- UPDATED: handleBlockUser ---
const handleBlockUser = async (user) => {
  const action = user.is_blocked ? 'unblock' : 'block';
  
  if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

  try {
    const response = await API.put(`/admin/users/${user._id}/block`);
    
    // Use the message from your backend response ("User blocked successfully" etc.)
    alert(response.data.message); 
    
    fetchUsers(); // Refresh the list to show updated status
  } catch (error) {
    console.error(`Error trying to ${action} user:`, error);
    alert("An error occurred. Please try again.");
  }
};

  useEffect(() => {
    fetchStats();
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

        {/* --- UPDATED STATS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Users</p>
            <p className="text-4xl font-bold text-white mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Tenders</p>
            <p className="text-4xl font-bold text-indigo-400 mt-1">{stats.totalTenders}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-sm">
            {/* Label changed from Vendors to Proposals */}
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Proposals</p>
            <p className="text-4xl font-bold text-emerald-400 mt-1">{stats.totalProposals}</p>
          </div>
        </div>

        {/* Tab Navigation */}
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

        {/* Content Table Area */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 min-h-[400px]">
          {loading ? (
            <p className="text-gray-400">Loading data...</p>
          ) : activeTab === 'tenders' ? (
           /* Tenders Table */
<div className="overflow-x-auto">
  <table className="w-full text-left">
    <thead>
      <tr className="text-gray-400 border-b border-gray-700">
        <th className="pb-3 px-2">Title</th>
        <th className="pb-3 px-2">Status</th>
        <th className="pb-3 px-2 text-right">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-700">
      {tenders.map((tender) => (
        <tr key={tender._id}>
          <td className="py-4 px-2">{tender.title}</td>
          <td className="py-4 px-2">
            {/* Show status Badge */}
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
              tender.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' : 
              tender.status === 'rejected' ? 'bg-red-900/50 text-red-400' : 
              'bg-amber-900/50 text-amber-400' // For 'pending'
            }`}>
              {tender.status}
            </span>
          </td>
          <td className="py-4 px-2 text-right">
            <button 
              onClick={() => handleToggleTenderStatus(tender)} 
              className={`px-3 py-1.5 rounded text-xs transition ${
                tender.status === 'active' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {tender.status === 'active' ? 'Reject' : 'Approve'}
            </button>
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
                    <th className="pb-3 px-2">Vendor</th>
                    <th className="pb-3 px-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {proposals.map((prop) => (
                    <tr key={prop._id}>
                      <td className="py-4 px-2">{prop.vendorId?.name || 'N/A'}</td>
                      <td className="py-4 px-2 text-emerald-400 font-bold">${prop.proposedAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Users Table */
            /* Users Table */
<div className="overflow-x-auto">
  <table className="w-full text-left">
    <thead>
      <tr className="text-gray-400 border-b border-gray-700">
        <th className="pb-3 px-2">Name</th>
        <th className="pb-3 px-2">Status</th> {/* New Status Column */}
        <th className="pb-3 px-2 text-right">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-700">
      {users.map((user) => (
        <tr key={user._id}>
          <td className="py-4 px-2">{user.name}</td>
          <td className="py-4 px-2">
            {/* Show status Badge */}
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
              user.is_blocked ? 'bg-red-900/50 text-red-400' : 'bg-emerald-900/50 text-emerald-400'
            }`}>
              {user.is_blocked ? 'Blocked' : 'Active'}
            </span>
          </td>
          <td className="py-4 px-2 text-right">
            {(user.role !== 'admin' && user.user_type !== 'admin') && (
              <button 
                onClick={() => handleBlockUser(user)} // Pass the whole user object
                className={`px-3 py-1.5 rounded text-xs transition ${
                  user.is_blocked 
                    ? 'bg-emerald-600 hover:bg-emerald-700' // Green for Unblock
                    : 'bg-red-600 hover:bg-red-700'         // Red for Block
                }`}
              >
                {user.is_blocked ? 'Unblock' : 'Block'}
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