import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import PostForm from '../../components/posts/PostForm';

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const submit = async (formData) => {
    await api.post('/posts', formData);
    navigate(['Admin', 'Editor'].includes(user.role) ? '/dashboard/all-posts' : '/dashboard/my-posts');
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{user.role === 'Contributor' ? 'Submit a Post' : 'Create Post'}</h1>
      <PostForm onSubmit={submit} />
    </div>
  );
}