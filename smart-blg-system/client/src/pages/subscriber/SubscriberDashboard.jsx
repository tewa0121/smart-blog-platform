import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/common/StatCard';

export default function SubscriberDashboard() {
  const { user } = useAuth();
  const [comments, setComments] = useState(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get('/comments/mine').then((r) => setComments(r.data.length));
    api.get('/notifications/unread-count').then((r) => setUnread(r.data.count));
  }, []);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Welcome, {user.full_name} 👋</h1>
        <p className="mt-1 text-gray-600">Read posts, leave comments and get notified about new articles.</p>
        <Link to="/" className="btn-primary mt-4">Browse posts</Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="My comments" value={comments} color="text-blue-600" />
        <StatCard label="Unread notifications" value={unread} color="text-red-600" />
      </div>
    </div>
  );
}