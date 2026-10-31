import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import PostTable from '../../components/posts/PostTable';
import Loader from '../../components/common/Loader';

export default function ReviewQueue() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts/manage/all')
      .then((r) => setPosts(r.data.filter((p) => ['Pending', 'Approved'].includes(p.status))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Review Queue</h1>
      <p className="mb-4 text-sm text-gray-600">Pending posts need review. Approved posts are ready to be published.</p>
      {loading ? <Loader /> : (
        <PostTable
          posts={posts}
          showAuthor
          renderActions={(p) => (
            <Link to={`/dashboard/review/${p.post_id}`} className="btn-primary !px-3 !py-1">Review</Link>
          )}
        />
      )}
    </div>
  );
}