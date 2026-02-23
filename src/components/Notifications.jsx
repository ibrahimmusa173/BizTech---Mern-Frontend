import { useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await API.get('/notifications');
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>
      <ul className="space-y-3 max-h-60 overflow-y-auto">
        {notifications.map((notif) => {
          // Extracting the class string logic avoids JSX parsing errors
          const liClass = notif.isRead
            ? "p-3 rounded-lg flex justify-between items-center bg-gray-700/50 text-gray-400"
            : "p-3 rounded-lg flex justify-between items-center bg-gray-700 text-white border-l-4 border-indigo-500";

          return (
            <li key={notif._id} className={liClass}>
              <span className="text-sm">{notif.message}</span>
              {!notif.isRead && (
                <button 
                  onClick={() => markAsRead(notif._id)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition ml-4 shrink-0"
                >
                  Mark as Read
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Notifications;