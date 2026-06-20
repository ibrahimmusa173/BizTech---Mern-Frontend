import { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import TenderDetails from './TenderDetails';

const ActiveTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setSearching(true);
        const url = query.trim()
          ? `/tenders/search?q=${encodeURIComponent(query)}`
          : '/tenders';

        const response = await API.get(url);

        let extractedData = [];
        if (Array.isArray(response.data)) {
          extractedData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          extractedData = response.data.data;
        } else if (response.data && Array.isArray(response.data.tenders)) {
          extractedData = response.data.tenders;
        }
        setTenders(extractedData);
      } catch (error) {
        console.error('Failed to fetch tenders:', error);
      } finally {
        setSearching(false);
      }
    };

    const timer = setTimeout(fetchTenders, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (selectedTender) {
    return <TenderDetails tenderId={selectedTender} onBack={() => setSelectedTender(null)} />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Active / Open Tenders</h2>

      <div className="mb-6 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tenders by title, description, category..."
          className="w-full p-3 pl-4 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
        />
        {searching && (
          <span className="absolute right-3 top-3 text-gray-400 text-sm">Searching...</span>
        )}
      </div>

      {tenders.length === 0 ? (
        <p className="text-gray-400">
          {query ? `No tenders found for "${query}"` : 'No open tenders available at the moment.'}
        </p>
      ) : (
        <div className="space-y-4">
          {tenders.map((tender) => (
            <div
              key={tender._id}
              className="bg-gray-700 p-5 rounded border border-gray-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-white">{tender.title}</h3>
                  <span className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase ${tender.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {tender.status || 'ACTIVE'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Deadline: {new Date(tender.deadline).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedTender(tender._id)}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded transition font-medium whitespace-nowrap"
              >
                View Details & Bid
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveTenders;