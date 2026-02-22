// src/pages/EditProfile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api/axiosInstance';

const EditProfile = () => {
  const [profile, setProfile] = useState({ name: '', company_name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user_type } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/auth/profile');
        const userData = response.data.data; // Correctly unwrap data
        
        setProfile({ 
          name: userData.name || '', 
          company_name: userData.company_name || '', 
          email: userData.email || '' 
        });
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Send PUT request to update profile
      await API.put('/auth/profile', { 
        name: profile.name, 
        company_name: profile.company_name 
      });
      navigateBack();
    } catch  {
      alert("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const navigateBack = () => {
    const role = user_type?.toLowerCase();
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'client') navigate('/client/dashboard');
    else if (role === 'vendor') navigate('/vendor/dashboard');
    else navigate('/profile');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
        <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-4">Update Profile</h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-gray-400 mb-1 text-sm">
              Email Address <span className="text-xs text-gray-500">(Cannot be changed)</span>
            </label>
            <input 
              type="email" 
              value={profile.email} 
              disabled
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-400 cursor-not-allowed focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})} 
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              required 
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 text-sm">Company Name</label>
            <input 
              type="text" 
              value={profile.company_name} 
              onChange={e => setProfile({...profile, company_name: e.target.value})} 
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          
          <div className="flex gap-4 pt-6 border-t border-gray-700 mt-6">
            <button 
              type="button" 
              onClick={navigateBack}
              className="w-1/2 bg-transparent hover:bg-gray-700 border border-gray-600 text-white font-bold py-3 rounded-lg transition duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;