import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setLogout } from '../store/authSlice';
import UserProfileCard from '../components/UserProfileCard';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user_type } = useSelector((state) => state.auth);

  // ✅ Normalize role safely (handles "Client", "CLIENT", " client ", etc.)
  const normalizedRole = user_type?.trim().toLowerCase();

  const isValidUserType =
    normalizedRole === 'client' ||
    normalizedRole === 'vendor' ||
    normalizedRole === 'admin';

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>

        <div className="flex items-center gap-4">
          {/* ✅ Dashboard Button */}
          {isValidUserType && (
            <Link
              to={`/${normalizedRole}/dashboard`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              Go to Dashboard
            </Link>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg text-white font-medium transition shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <UserProfileCard />
      </div>
    </div>
  );
};

export default Profile;