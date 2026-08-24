// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import PostCard from '../components/PostCard';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data.posts);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-10">Loading posts...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">📚 All Blog Posts</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. {token && <span>Create your first post!</span>}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;