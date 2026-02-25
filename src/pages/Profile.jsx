import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../store/authSlice';
import API from '../api/axiosInstance';

const Profile = () => {
  const { user_type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({
    name: '',
    company_name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);

  // Determine dashboard link based on role
  const dashboardLink =
    user_type?.toLowerCase() === 'vendor'
      ? '/vendor/dashboard'
      : user_type?.toLowerCase() === 'admin'
      ? '/admin/dashboard'
      : '/client/dashboard';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    dispatch(setLogout());
  };

  if (loading) {
    return <p className="text-gray-400">Loading profile...</p>;
  }

  return (
    <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">
        My Profile
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p className="text-white font-medium">
            {profile.name}
          </p>
        </div>

        {profile.company_name && (
          <div>
            <p className="text-gray-400 text-sm">
              Company Name
            </p>
            <p className="text-white font-medium">
              {profile.company_name}
            </p>
          </div>
        )}

        <div>
          <p className="text-gray-400 text-sm">Email</p>
          <p className="text-white font-medium">
            {profile.email}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Link
          to={dashboardLink}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm font-medium transition"
        >
          Back to Dashboard
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;