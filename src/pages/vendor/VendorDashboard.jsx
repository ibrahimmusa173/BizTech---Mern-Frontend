import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setLogout } from '../../store/authSlice';
import API from '../../api/axiosInstance';
import Notifications from '../../components/Notifications';
import ActiveTenders from './ActiveTenders';
import MyProposals from './MyProposals';

const VendorDashboard = () => {
  const dispatch = useDispatch();
  // Get user info from Redux store
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('active_tenders');
  const [loadingPayment, setLoadingPayment] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoadingPayment(true);
      const response = await API.post('/payments/create-checkout-session');
      
      if (response.data.url) {
        // Redirect the user to the Stripe Checkout page
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <div className="flex gap-4">
            <Link to="/profile" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-bold transition flex items-center">
              Profile
            </Link>
            <button onClick={() => dispatch(setLogout())} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold transition">
              Logout
            </button>
          </div>
        </div>

        {/* PREMIUM UPGRADE BANNER - Only shows if user is NOT premium */}
        {!user?.isPremium && (
          <div className="mb-8 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 p-6 rounded-2xl border border-indigo-500 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                🚀 GO PREMIUM
              </h2>
              <p className="text-indigo-100 mt-1">
                Unlock full access to client emails, names, and company details to close deals faster.
              </p>
            </div>
            <button 
              onClick={handleUpgrade}
              disabled={loadingPayment}
              className="whitespace-nowrap bg-white text-indigo-700 hover:bg-gray-100 px-8 py-3 rounded-full font-extrabold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg"
            >
              {loadingPayment ? 'Processing...' : 'Upgrade Now - $50'}
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Notifications />
            
            {/* Status Badge */}
            <div className={`p-4 rounded-xl border flex flex-col items-center gap-1 ${user?.isPremium ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-800 border-gray-700'}`}>
               <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Account Status</span>
               <span className={`text-lg font-bold ${user?.isPremium ? 'text-green-400' : 'text-gray-300'}`}>
                {user?.isPremium ? '★ Premium Vendor' : 'Free Account'}
               </span>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col space-y-2">
              <button 
                onClick={() => setActiveTab('active_tenders')}
                className={`w-full text-left px-4 py-3 rounded font-medium transition ${activeTab === 'active_tenders' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
              >
                Open Tenders
              </button>
              <button 
                onClick={() => setActiveTab('my_proposals')}
                className={`w-full text-left px-4 py-3 rounded font-medium transition ${activeTab === 'my_proposals' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
              >
                My Proposals
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-gray-800 p-6 rounded-xl border border-gray-700 min-h-[500px]">
            {activeTab === 'active_tenders' && <ActiveTenders />}
            {activeTab === 'my_proposals' && <MyProposals />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;