import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import CommentForm from '../../components/comments/CommentForm';
import CommentList from '../../components/comments/CommentList';
import { errMsg, formatDate, imgUrl } from '../../utils/helpers';

export default function PostDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [commentsOn, setCommentsOn] = useState(true);

  const loadComments = useCallback(
    () => api.get(`/comments/post/${id}`).then((r) => setComments(r.data)),
    [id]
  );

  useEffect(() => {
    api.get(`/posts/${id}`).then((r) => { setPost(r.data); loadComments(); }).catch((e) => setError(errMsg(e)));
  }, [id, loadComments]);

  useEffect(() => {
    api.get('/settings').then((r) => setCommentsOn(r.data.comments_enabled)).catch(() => {});
  }, []);

  if (error) return <p className="py-12 text-center text-red-600">{error}</p>;
  if (!post) return <Loader />;

  return (
    <article className="mx-auto max-w-3xl">
      {post.image && <img src={imgUrl(post.image)} alt="" className="mb-6 max-h-96 w-full rounded-xl object-cover" />}
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        By {post.author} • {formatDate(post.created_at)} {post.category_name && `• ${post.category_name}`}
      </p>
      <div className="mt-6 whitespace-pre-wrap leading-7 text-gray-800">{post.content}</div>

      <hr className="my-8" />
      <h2 className="mb-4 text-xl font-semibold">Comments ({comments.length})</h2>

      {post.status === 'Published' && (
        !commentsOn ? (
          <p className="mb-4 rounded bg-yellow-50 p-2 text-sm text-yellow-800">
            Comments are turned off by the administrator.
          </p>
        ) : user ? (
          <CommentForm postId={post.post_id} onAdded={loadComments} />
        ) : (
          <p className="mb-4 text-sm text-gray-600">
            <Link to="/login" className="text-indigo-600 hover:underline">Login</Link> to comment.
          </p>
        )
      )}

      <CommentList comments={comments} onChanged={loadComments} />
    </article>
  );
}