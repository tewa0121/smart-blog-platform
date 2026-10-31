import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { errMsg } from '../../utils/helpers';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-gray-500">Join to read, comment and get notified about new posts.</p>
      </div>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <input className="input" placeholder="Full name" value={form.full_name} onChange={set('full_name')} required />
      <input className="input" placeholder="Username" value={form.username} onChange={set('username')} required />
      <input className="input" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
      <input className="input" type="password" placeholder="Password (min 6)" value={form.password} onChange={set('password')} required />
      <button className="btn-primary w-full">Get Started</button>
      <p className="text-center text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
      </p>
    </form>
  );
}