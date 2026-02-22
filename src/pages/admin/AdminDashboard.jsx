import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout } from '../../store/authSlice';
import UserProfileCard from '../../components/UserProfileCard';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-600/90 hover:bg-red-600 px-5 py-2.5 rounded-lg text-white font-medium transition shadow-lg"
        >
          Logout
        </button>
      </div>
      <div className="max-w-4xl mx-auto">
         {/* Profile Card drops right in! */}
         <UserProfileCard />
      </div>
    </div>
  );
};

export default AdminDashboard;