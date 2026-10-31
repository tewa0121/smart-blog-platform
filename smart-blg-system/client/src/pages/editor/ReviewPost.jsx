import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { errMsg, formatDate, imgUrl, statusColor } from '../../utils/helpers';

export default function ReviewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/posts/${id}`).then((r) => setPost(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);

  const act = async (action) => {
    setError('');
    try {
      await api.patch(`/posts/${id}/review`, { action, note });
      navigate('/dashboard/review');
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (!post) return error ? <p className="text-red-600">{error}</p> : <Loader />;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <article className="card p-6 lg:col-span-2">
        {post.image && <img src={imgUrl(post.image)} alt="" className="mb-4 max-h-72 w-full rounded-lg object-cover" />}
        <span className={`rounded px-2 py-0.5 text-xs ${statusColor[post.status]}`}>{post.status}</span>
        <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          By {post.author} • {formatDate(post.created_at)} {post.category_name && `• ${post.category_name}`}
        </p>
        <div className="mt-4 whitespace-pre-wrap leading-7">{post.content}</div>
      </article>

      <div className="card h-fit space-y-3 p-4">
        <h2 className="font-semibold">Decision</h2>
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <textarea className="input" rows="4" placeholder="Note to author (required for rejection)" value={note} onChange={(e) => setNote(e.target.value)} />
        <Link to={`/dashboard/edit-post/${post.post_id}`} className="btn-outline w-full">✏️ Edit / fix grammar</Link>
        <button onClick={() => act('approve')} className="btn-outline w-full" disabled={post.status === 'Draft'}>✅ Approve</button>
        <button onClick={() => act('publish')} className="btn-primary w-full" disabled={post.status === 'Draft'}>🚀 Publish</button>
        <button onClick={() => act('reject')} className="btn-danger w-full" disabled={post.status === 'Draft'}>❌ Reject</button>
        {post.status === 'Draft' && <p className="text-xs text-gray-500">Drafts have not been submitted yet.</p>}
      </div>
    </div>
  );
}