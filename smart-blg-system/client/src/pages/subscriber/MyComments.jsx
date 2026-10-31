import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';

export default function MyComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => api.get('/comments/mine').then((r) => setComments(r.data)).finally(() => setLoading(false)), []);
  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!confirm('Delete this comment?')) return;
    await api.delete(`/comments/${id}`);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My Comments</h1>
      {comments.length === 0 && <p className="card p-6 text-center text-gray-500">You have not commented yet.</p>}
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.comment_id} className="card p-4">
            <Link to={`/posts/${c.post_id}`} className="font-medium text-indigo-600 hover:underline">{c.post_title}</Link>
            <p className="mt-1 text-sm text-gray-700">{c.comment_text}</p>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>{formatDate(c.created_at)}</span>
              <button onClick={() => remove(c.comment_id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}