import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/common/StatCard';

const icon = { user: '👤', post: '📝', comment: '💬' };

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);

  useEffect(() => { api.get('/reports').then((r) => setReport(r.data)); }, []);
  const pending = report?.postsByStatus.find((s) => s.status === 'Pending')?.count || 0;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Welcome, {user.full_name} 👋</h1>
        <p className="mt-1 text-gray-600">You have full control of the system.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/dashboard/users" className="btn-primary">Manage Users</Link>
          <Link to="/dashboard/all-posts" className="btn-outline">All Posts</Link>
          <Link to="/dashboard/reports" className="btn-outline">Reports</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Users" value={report?.totals.users ?? '…'} />
        <StatCard label="Posts" value={report?.totals.posts ?? '…'} color="text-green-600" />
        <StatCard label="Comments" value={report?.totals.comments ?? '…'} color="text-blue-600" />
        <StatCard label="Pending posts" value={report ? pending : '…'} color="text-yellow-600" />
      </div>

      <div className="card p-5">
        <h2 className="mb-3 text-lg font-semibold">Recent Activities</h2>
        {!report && <p className="text-sm text-gray-500">Loading...</p>}
        {report && report.recent.length === 0 && <p className="text-sm text-gray-500">No activity yet.</p>}
        <ul className="divide-y">
          {report?.recent.map((a, i) => (
            <li key={i} className="flex items-start gap-3 py-3">
              <span className="text-xl">{icon[a.type]}</span>
              <div className="min-w-0 flex-1 text-sm">
                <p>
                  <b>{a.actor}</b> {a.text}
                </p>
                <p className="text-xs text-gray-500">{timeAgo(a.at)}</p>
              </div>
              {a.post_id && (
                <Link to={`/posts/${a.post_id}`} className="text-xs text-indigo-600 hover:underline">View</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}