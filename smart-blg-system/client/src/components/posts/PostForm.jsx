import { useEffect, useState } from 'react';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { errMsg, imgUrl } from '../../utils/helpers';

export default function PostForm({ initial, onSubmit }) {
  const { user } = useAuth();
  const editing = Boolean(initial);
  const canPublish = user.role !== 'Contributor';

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: initial?.title || '',
    content: initial?.content || '',
    category_id: initial?.category_id || '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [grammar, setGrammar] = useState(null);
  const [tips, setTips] = useState(null);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // status undefined = keep current status (edit mode)
  const send = async (status) => {
    setError('');
    if (!form.title.trim() || !form.content.trim()) return setError('Title and content are required');
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('content', form.content);
    fd.append('category_id', form.category_id);
    if (status) fd.append('status', status);
    if (image) fd.append('image', image);
    setBusy(true);
    try {
      await onSubmit(fd);
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  const checkGrammar = async () => {
    try {
      setGrammar((await api.post('/ai/grammar', { text: form.content })).data);
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const suggest = async () => {
    try {
      setTips((await api.post('/ai/suggest', { title: form.title, content: form.content })).data);
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card space-y-4 p-5 lg:col-span-2">
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        {initial?.status === 'Rejected' && initial.reviewer_note && (
          <p className="rounded bg-yellow-50 p-2 text-sm text-yellow-800">
            Rejected by editor: {initial.reviewer_note}
          </p>
        )}

        <input className="input text-lg" placeholder="Post title" value={form.title} onChange={set('title')} />

        <select className="input" value={form.category_id} onChange={set('category_id')}>
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
          ))}
        </select>

        <textarea className="input" rows="14" placeholder="Write your post..." value={form.content} onChange={set('content')} />

        <div>
          <label className="mb-1 block text-sm font-medium">Image (jpg, png, gif, webp, max 5 MB)</label>
          {initial?.image && !image && (
            <img src={imgUrl(initial.image)} alt="" className="mb-2 h-32 rounded object-cover" />
          )}
          {image && <img src={URL.createObjectURL(image)} alt="" className="mb-2 h-32 rounded object-cover" />}
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0] || null)} className="text-sm" />
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4">
          {editing && <button disabled={busy} onClick={() => send()} className="btn-primary">Save changes</button>}
          <button disabled={busy} onClick={() => send('Draft')} className="btn-outline">Save as Draft</button>
          <button disabled={busy} onClick={() => send('Pending')} className="btn-outline">Submit for Review</button>
          {canPublish && (
            <button disabled={busy} onClick={() => send('Published')} className="btn-primary">Publish</button>
          )}
        </div>
        {!canPublish && (
          <p className="text-xs text-gray-500">Contributors cannot publish directly. Submit for review and an editor will publish it.</p>
        )}
      </div>

      {/* AI assistance */}
      <div className="space-y-4">
        <div className="card p-4">
          <h3 className="mb-3 font-semibold">🤖 AI Assistance</h3>
          <div className="flex gap-2">
            <button onClick={checkGrammar} className="btn-outline flex-1" disabled={!form.content.trim()}>Check grammar</button>
            <button onClick={suggest} className="btn-outline flex-1" disabled={!form.content.trim()}>Suggestions</button>
          </div>
        </div>

        {grammar && (
          <div className="card p-4 text-sm">
            <p className="font-semibold">{grammar.issues.length ? `${grammar.issues.length} issue(s) found` : '✅ No issues found'}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
              {grammar.issues.map((i, n) => <li key={n}>{i.message}</li>)}
            </ul>
            {grammar.corrected !== form.content && (
              <button className="btn-primary mt-3 w-full" onClick={() => { setForm({ ...form, content: grammar.corrected }); setGrammar(null); }}>
                Apply corrections
              </button>
            )}
          </div>
        )}

        {tips && (
          <div className="card space-y-3 p-4 text-sm">
            <p className="text-gray-500">{tips.wordCount} words • about {tips.readingTimeMinutes} min read</p>
            <div>
              <p className="font-semibold">Summary</p>
              <p className="text-gray-700">{tips.summary}</p>
            </div>
            <div>
              <p className="font-semibold">Keywords</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {tips.keywords.map((k) => <span key={k} className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{k}</span>)}
              </div>
            </div>
            <div>
              <p className="font-semibold">Title ideas (click to use)</p>
              {tips.titleSuggestions.map((t) => (
                <button key={t} onClick={() => setForm({ ...form, title: t })} className="mt-1 block w-full rounded bg-gray-50 p-2 text-left hover:bg-indigo-50">{t}</button>
              ))}
            </div>
            {tips.suggestedCategory && (
              <button className="btn-outline w-full" onClick={() => setForm({ ...form, category_id: tips.suggestedCategory.category_id })}>
                Use category: {tips.suggestedCategory.category_name}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}