import { useCallback, useEffect, useState } from 'react';
import api from '../../api/axios';
import { errMsg } from '../../utils/helpers';

export default function Settings() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [commentsOn, setCommentsOn] = useState(true);

  const load = useCallback(() => api.get('/categories').then((r) => setCats(r.data)), []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.get('/settings').then((r) => setCommentsOn(r.data.comments_enabled));
  }, []);

  const run = async (fn) => {
    try { await fn(); setError(''); load(); } catch (e) { setError(errMsg(e)); }
  };

  const toggleComments = () =>
    run(async () => {
      const next = !commentsOn;
      await api.put('/settings', { comments_enabled: next });
      setCommentsOn(next);
    });

  const add = (e) => {
    e.preventDefault();
    run(async () => { await api.post('/categories', { category_name: name }); setName(''); });
  };

  const rename = (c) => {
    const n = prompt('New category name', c.category_name);
    if (n && n.trim()) run(() => api.put(`/categories/${c.category_id}`, { category_name: n.trim() }));
  };

  const remove = (c) => {
    if (confirm(`Delete "${c.category_name}"? Its posts will become uncategorized.`))
      run(() => api.delete(`/categories/${c.category_id}`));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Settings</h1>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <div className="card flex items-center justify-between p-4">
        <div>
          <h2 className="font-semibold">Allow comments</h2>
          <p className="text-sm text-gray-600">
            When off, readers cannot post new comments. Existing comments stay visible.
          </p>
        </div>
        <button onClick={toggleComments} className={commentsOn ? 'btn-primary' : 'btn-danger'}>
          {commentsOn ? 'ON (click to turn off)' : 'OFF (click to turn on)'}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <form onSubmit={add} className="card flex gap-2 p-4">
          <input className="input" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} required />
          <button className="btn-primary whitespace-nowrap">Add</button>
        </form>

        <div className="card divide-y">
          {cats.map((c) => (
            <div key={c.category_id} className="flex items-center justify-between p-3">
              <div>
                <span className="font-medium">{c.category_name}</span>
                <span className="ml-2 text-xs text-gray-500">{c.post_count} published</span>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => rename(c)} className="text-indigo-600 hover:underline">Rename</button>
                <button onClick={() => remove(c)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}