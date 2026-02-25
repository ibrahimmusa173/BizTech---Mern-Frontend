import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setLogout } from '../../store/authSlice';
import Notifications from '../../components/Notifications';
import ActiveTenders from './ActiveTenders';
import MyProposals from './MyProposals';

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const[activeTab, setActiveTab] = useState('active_tenders');

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
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Notifications />
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