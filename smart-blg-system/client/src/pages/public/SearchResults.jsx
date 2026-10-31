import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import PostCard from '../../components/posts/PostCard';
import Loader from '../../components/common/Loader';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/posts', { params: { search: q, limit: 50 } })
      .then((r) => setPosts(r.data.posts))
      .finally(() => setLoading(false));
  }, [q]);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Search results for “{q}” ({posts.length})</h1>
      {posts.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No posts found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => <PostCard key={p.post_id} post={p} />)}
        </div>
      )}
    </div>
  );
}