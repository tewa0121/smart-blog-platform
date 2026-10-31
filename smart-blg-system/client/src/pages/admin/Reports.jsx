import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';

function Bars({ title, rows, label }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="card p-4">
      <h3 className="mb-3 font-semibold">{title}</h3>
      {rows.length === 0 && <p className="text-sm text-gray-500">No data yet.</p>}
      {rows.map((r) => (
        <div key={r[label]} className="mb-2">
          <div className="flex justify-between text-sm"><span>{r[label]}</span><span>{r.count}</span></div>
          <div className="h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-indigo-600" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  const [r, setR] = useState(null);
  useEffect(() => { api.get('/reports').then((res) => setR(res.data)); }, []);
  if (!r) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Report</h1>
        <button onClick={() => window.print()} className="btn-outline">🖨️ Print</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total users" value={r.totals.users} />
        <StatCard label="Total posts" value={r.totals.posts} color="text-green-600" />
        <StatCard label="Total comments" value={r.totals.comments} color="text-blue-600" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Bars title="Users by role" rows={r.usersByRole} label="role_name" />
        <Bars title="Posts by status" rows={r.postsByStatus} label="status" />
        <Bars title="Posts by category" rows={r.postsByCategory} label="category_name" />
        <div className="card p-4">
          <h3 className="mb-3 font-semibold">Most discussed posts</h3>
          {r.topPosts.length === 0 && <p className="text-sm text-gray-500">No published posts yet.</p>}
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {r.topPosts.map((p) => (
              <li key={p.post_id}>
                <Link to={`/posts/${p.post_id}`} className="text-indigo-600 hover:underline">{p.title}</Link> ({p.comments} comments)
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}