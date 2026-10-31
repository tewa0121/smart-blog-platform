import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { formatDate } from '../../utils/helpers';

export default function CommentList({ comments, onChanged }) {
  const { user } = useAuth();

  const remove = async (id) => {
    if (!confirm('Delete this comment?')) return;
    await api.delete(`/comments/${id}`);
    onChanged();
  };

  if (!comments.length) return <p className="text-sm text-gray-500">No comments yet.</p>;

  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c.comment_id} className="rounded-lg bg-gray-50 p-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{c.full_name}</span>
            <span className="text-gray-500">{formatDate(c.created_at)}</span>
          </div>
          <p className="mt-1 text-sm text-gray-700">{c.comment_text}</p>
          {user && (user.user_id === c.user_id || ['Admin', 'Editor'].includes(user.role)) && (
            <button onClick={() => remove(c.comment_id)} className="mt-1 text-xs text-red-600 hover:underline">Delete</button>
          )}
        </li>
      ))}
    </ul>
  );
}