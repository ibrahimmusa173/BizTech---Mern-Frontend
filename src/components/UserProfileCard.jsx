// src/components/UserProfileCard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance';

const UserProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/auth/profile');
        // Backend returns { success: true, data: { ...user } }
        // Axios wraps it in response.data. So we need response.data.data
        setProfile(response.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 w-full flex items-center justify-center">
        <div className="text-indigo-400 font-medium animate-pulse">Loading profile data...</div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-red-400 p-4">Failed to load profile. Please try logging in again.</div>;
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 w-full">
      <div className="flex items-center space-x-5 mb-6 border-b border-gray-700 pb-6">
        <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase text-white shadow-inner">
          {profile.name ? profile.name.charAt(0) : 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">{profile.name}</h2>
          <span className="inline-block mt-1 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full capitalize border border-indigo-500/30">
            {profile.user_type}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
          <p className="text-gray-400 text-sm mb-1 font-medium">Email Address</p>
          <p className="text-lg font-semibold text-gray-200">{profile.email}</p>
        </div>
        
        {/* Only show Company Name if it exists (Admin might not have one) */}
        {profile.company_name && (
          <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
            <p className="text-gray-400 text-sm mb-1 font-medium">Company Name</p>
            <p className="text-lg font-semibold text-gray-200">{profile.company_name}</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end">
        <Link 
          to="/edit-profile" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-indigo-500/30"
        >
          Update Profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfileCard;