import { useState } from 'react';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { errMsg } from '../../utils/helpers';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ full_name: user.full_name, username: user.username, email: user.email });
  const [pw, setPw] = useState({ current_password: '', new_password: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const flash = (type, text) => setMsg({ type, text });

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', form);
      setUser((await api.get('/auth/me')).data);
      flash('ok', 'Profile updated');
    } catch (err) { flash('err', errMsg(err)); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/password', pw);
      setPw({ current_password: '', new_password: '' });
      flash('ok', 'Password changed');
    } catch (err) { flash('err', errMsg(err)); }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      {msg.text && (
        <p className={`rounded p-2 text-sm ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>
      )}

      <form onSubmit={saveProfile} className="card space-y-3 p-5">
        <h2 className="font-semibold">Account details <span className="ml-2 rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{user.role}</span></h2>
        <input className="input" placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <input className="input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <button className="btn-primary">Save changes</button>
      </form>

      <form onSubmit={savePassword} className="card space-y-3 p-5">
        <h2 className="font-semibold">Change password</h2>
        <input className="input" type="password" placeholder="Current password" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} required />
        <input className="input" type="password" placeholder="New password (min 6)" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} required />
        <button className="btn-primary">Change password</button>
      </form>
    </div>
  );
}