import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { errMsg } from '../../utils/helpers';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.identifier, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-gray-500">Login to your account to continue.</p>
      </div>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <input className="input" placeholder="Username or email" value={form.identifier}
        onChange={(e) => setForm({ ...form, identifier: e.target.value })} required />
      <input className="input" type="password" placeholder="Password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
      <p className="text-center text-sm text-gray-600">
        No account? <Link to="/register" className="text-indigo-600 hover:underline">Get started</Link>
      </p>
      <p className="text-center text-sm">
        <Link to="/home" className="text-gray-500 hover:underline">Browse posts without logging in</Link>
      </p>
    </form>
  );
}