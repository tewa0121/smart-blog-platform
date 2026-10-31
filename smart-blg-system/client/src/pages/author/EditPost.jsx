import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import PostForm from '../../components/posts/PostForm';
import Loader from '../../components/common/Loader';
import { errMsg } from '../../utils/helpers';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/posts/${id}`).then((r) => setPost(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);

  const submit = async (formData) => {
    await api.put(`/posts/${id}`, formData);
    navigate(['Admin', 'Editor'].includes(user.role) ? '/dashboard/all-posts' : '/dashboard/my-posts');
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!post) return <Loader />;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Edit Post</h1>
      <PostForm initial={post} onSubmit={submit} />
    </div>
  );
}