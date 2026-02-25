import { useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get('/notifications');
        
        // FIX: Handle both direct array [...] and object wrapper { data: [...] }
        const data = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);
          
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setNotifications([]); // Prevent crash by enforcing array
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);

      // Update UI locally instead of refetching
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === id
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">No new notifications.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-3 rounded flex flex-col gap-2 transition-all ${
                notif.isRead
                  ? 'bg-gray-700/50 text-gray-400'
                  : 'bg-gray-700 border-l-4 border-indigo-500 text-gray-200'
              }`}
            >
              <span className="text-sm">
                {notif.message}
              </span>

              {!notif.isRead && (
                <button
                  onClick={() => markAsRead(notif._id)}
                  className="self-start text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded transition"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;