import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import PostCard from '../../components/posts/PostCard';
import Loader from '../../components/common/Loader';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const page = Number(params.get('page') || 1);

  const [data, setData] = useState({ posts: [], pages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/categories').then((r) => setCategories(r.data)); }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/posts', { params: { search, category, page } })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const update = (changes) => {
    const next = Object.fromEntries(params);
    Object.assign(next, changes);
    Object.keys(next).forEach((k) => !next[k] && delete next[k]);
    setParams(next);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => update({ category: '', page: '' })}
          className={category ? 'btn-outline' : 'btn-primary'}>All</button>
        {categories.map((c) => (
          <button key={c.category_id} onClick={() => update({ category: c.category_id, page: '' })}
            className={String(c.category_id) === category ? 'btn-primary' : 'btn-outline'}>
            {c.category_name} ({c.post_count})
          </button>
        ))}
      </div>

      {search && <p className="mb-4 text-gray-600">Results for “{search}” ({data.total})</p>}

      {loading ? <Loader /> : data.posts.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No posts found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((p) => <PostCard key={p.post_id} post={p} />)}
        </div>
      )}

      {data.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button className="btn-outline" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>Previous</button>
          <span className="text-sm">Page {page} of {data.pages}</span>
          <button className="btn-outline" disabled={page >= data.pages} onClick={() => update({ page: page + 1 })}>Next</button>
        </div>
      )}
    </div>
  );
}