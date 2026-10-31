import { useCallback, useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => api.get('/notifications').then((r) => setItems(r.data)).finally(() => setLoading(false)), []);
  useEffect(() => { load(); }, [load]);

  const read = async (n) => {
    if (n.is_read) return;
    await api.put(`/notifications/${n.notification_id}/read`);
    load();
  };

  const readAll = async () => {
    await api.put('/notifications/read-all');
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {items.some((n) => !n.is_read) && <button onClick={readAll} className="btn-outline">Mark all as read</button>}
      </div>
      {items.length === 0 && <p className="card p-6 text-center text-gray-500">No notifications.</p>}
      <div className="space-y-2">
        {items.map((n) => (
          <button key={n.notification_id} onClick={() => read(n)}
            className={`card block w-full p-3 text-left ${n.is_read ? '' : 'border-indigo-300 bg-indigo-50'}`}>
            <p className="text-sm">{n.message}</p>
            <p className="mt-1 text-xs text-gray-500">{formatDate(n.created_at)} {!n.is_read && '• New'}</p>
          </button>
        ))}
      </div>
    </div>
  );
}