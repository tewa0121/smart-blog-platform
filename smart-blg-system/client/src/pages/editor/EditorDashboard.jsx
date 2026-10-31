import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/common/StatCard';

export default function EditorDashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => { api.get('/posts/manage/all').then((r) => setPosts(r.data)); }, []);
  const count = (s) => posts.filter((p) => p.status === s).length;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Welcome, {user.full_name} 👋</h1>
        <p className="mt-1 text-gray-600">{count('Pending')} post(s) waiting for your review.</p>
        <Link to="/dashboard/review" className="btn-primary mt-4">Open Review Queue</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending" value={count('Pending')} color="text-yellow-600" />
        <StatCard label="Approved" value={count('Approved')} color="text-blue-600" />
        <StatCard label="Rejected" value={count('Rejected')} color="text-red-600" />
        <StatCard label="Published" value={count('Published')} color="text-green-600" />
      </div>
    </div>
  );
}