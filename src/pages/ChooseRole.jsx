import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin } from '../store/authSlice';
import API from '../api/axiosInstance';

const ChooseRole = () => {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = new URLSearchParams(window.location.search).get('token');

  const handleSubmit = async () => {
    if (!selected) return alert('Please select a role');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/set-role', 
        { user_type: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(setLogin({ token, user_type: selected, user: data.user }));
      localStorage.setItem('token', token);
      localStorage.setItem('user_type', selected);

      if (selected === 'vendor') navigate('/vendor/dashboard');
      else navigate('/client/dashboard');
     } catch {
      alert('Failed to set role. Please try again.');
    } finally {         
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          One last step
        </h2>
        <p className="text-gray-400 text-center mb-8">
          How will you be using the platform?
        </p>

        <div className="space-y-3 mb-8">
          {['client', 'vendor'].map((role) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selected === role
                  ? 'border-indigo-500 bg-indigo-500/10 text-white'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="font-semibold capitalize">{role}</div>
              <div className="text-sm mt-1 opacity-70">
                {role === 'client' 
                  ? 'I want to post tenders and find vendors'
                  : 'I want to bid on tenders and offer services'
                }
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Setting up your account...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;