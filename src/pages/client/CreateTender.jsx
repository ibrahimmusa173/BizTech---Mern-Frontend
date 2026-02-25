import { useState } from 'react';
import API from '../../api/axiosInstance';

const CreateTender = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/tenders', formData);
      alert('Tender created successfully!');
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create tender.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Create New Tender</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-gray-400 mb-1">Job / Tender Title</label>
          <input required type="text" className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500" 
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Description</label>
          <textarea required className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500 h-32" 
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Deadline</label>
          <input required type="datetime-local" className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-indigo-500" 
            value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
        </div>
        <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition disabled:opacity-50">
          {loading ? 'Creating...' : 'Submit Tender'}
        </button>
      </form>
    </div>
  );
};
export default CreateTender;