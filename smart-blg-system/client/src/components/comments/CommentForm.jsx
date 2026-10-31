import { useState } from 'react';
import api from '../../api/axios';
import { errMsg } from '../../utils/helpers';

export default function CommentForm({ postId, onAdded }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/comments/post/${postId}`, { comment_text: text });
      setText('');
      setError('');
      onAdded();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form onSubmit={submit} className="mb-6">
      <textarea className="input" rows="3" placeholder="Write a comment..." value={text} onChange={(e) => setText(e.target.value)} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <button className="btn-primary mt-2" disabled={!text.trim()}>Post Comment</button>
    </form>
  );
}