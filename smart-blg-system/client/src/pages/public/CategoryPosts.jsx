import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import PostCard from '../../components/posts/PostCard';
import Loader from '../../components/common/Loader';

export default function CategoryPosts() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/posts', { params: { category: id, limit: 50 } })
      .then((r) => setPosts(r.data.posts))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Category Posts</h1>
      {posts.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No posts in this category.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => <PostCard key={p.post_id} post={p} />)}
        </div>
      )}
    </div>
  );
}