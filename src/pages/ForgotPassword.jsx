import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/forgot-password', { email });
      setMessage("Reset link sent! Check your inbox.");
    } catch {
      setMessage("Failed to send link. Check email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
        <p className="text-gray-400 mb-6 text-sm">No worries, it happens. Enter your email below.</p>
        
        {message && (
          <div className="bg-green-900/30 border border-green-500 text-green-400 p-3 rounded mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="your-email@example.com"
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition duration-200">
            Send Reset Link
          </button>
        </form>

        <div className="mt-6">
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;