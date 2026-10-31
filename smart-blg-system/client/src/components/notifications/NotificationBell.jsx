import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = () => api.get('/notifications/unread-count').then((r) => setCount(r.data.count)).catch(() => {});
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <Link to="/dashboard/notifications" className="relative text-xl" title="Notifications">
      🔔
      {count > 0 && (
        <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  );
}