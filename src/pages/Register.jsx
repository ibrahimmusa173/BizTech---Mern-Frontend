import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosInstance';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    email: '',
    password: '',
    user_type: 'client'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', formData);
      alert("Success! Please login.");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "Error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500"
            placeholder="Full Name" 
            autoComplete="name"
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <input 
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500"
            placeholder="Company Name" 
            autoComplete="organization"
            onChange={e => setFormData({...formData, company_name: e.target.value})} 
            required 
          />
          <input 
            type="email"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500"
            placeholder="Email Address" 
            autoComplete="email"
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="password"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500"
            placeholder="Password" 
            autoComplete="new-password"
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required 
          />
          
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Join as a:</label>
            <select 
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500"
              value={formData.user_type} 
              onChange={e => setFormData({...formData, user_type: e.target.value})}
            >
              <option value="client">Client</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account? {' '}
          <Link to="/login" className="text-indigo-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;