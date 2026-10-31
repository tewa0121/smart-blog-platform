import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import PostTable from '../../components/posts/PostTable';
import Loader from '../../components/common/Loader';

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    () => api.get('/posts/mine', { params: { status } }).then((r) => setPosts(r.data)).finally(() => setLoading(false)),
    [status]
  );
  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    load();
  };

  const locked = (p) => user.role === 'Contributor' && ['Approved', 'Published'].includes(p.status);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{user.role === 'Contributor' ? 'My Drafts & Submissions' : 'My Posts'}</h1>
        <div className="flex gap-2">
          <select className="input w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {['Draft', 'Pending', 'Approved', 'Rejected', 'Published'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <Link to="/dashboard/create-post" className="btn-primary whitespace-nowrap">+ New</Link>
        </div>
      </div>

      {loading ? <Loader /> : (
        <PostTable
          posts={posts}
          renderActions={(p) => (
            <>
              {p.status === 'Published' && <Link to={`/posts/${p.post_id}`} className="text-indigo-600 hover:underline">View</Link>}
              {!locked(p) && <Link to={`/dashboard/edit-post/${p.post_id}`} className="text-indigo-600 hover:underline">Edit</Link>}
              <button onClick={() => remove(p.post_id)} className="text-red-600 hover:underline">Delete</button>
            </>
          )}
        />
      )}
    </div>
  );
}