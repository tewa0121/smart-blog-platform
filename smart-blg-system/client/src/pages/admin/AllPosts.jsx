import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import PostTable from '../../components/posts/PostTable';
import Loader from '../../components/common/Loader';

export default function AllPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    () => api.get('/posts/manage/all', { params: { status, search } }).then((r) => setPosts(r.data)).finally(() => setLoading(false)),
    [status, search]
  );
  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!confirm('Delete this post permanently?')) return;
    await api.delete(`/posts/${id}`);
    load();
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">All Posts</h1>
        <div className="flex gap-2">
          <input className="input w-48" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input w-36" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {['Draft', 'Pending', 'Approved', 'Rejected', 'Published'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? <Loader /> : (
        <PostTable
          posts={posts}
          showAuthor
          renderActions={(p) => (
            <>
              <Link to={`/posts/${p.post_id}`} className="text-indigo-600 hover:underline">View</Link>
              {['Pending', 'Approved'].includes(p.status) && (
                <Link to={`/dashboard/review/${p.post_id}`} className="text-green-700 hover:underline">Review</Link>
              )}
              <Link to={`/dashboard/edit-post/${p.post_id}`} className="text-indigo-600 hover:underline">Edit</Link>
              {user.role === 'Admin' && (
                <button onClick={() => remove(p.post_id)} className="text-red-600 hover:underline">Delete</button>
              )}
            </>
          )}
        />
      )}
    </div>
  );
}