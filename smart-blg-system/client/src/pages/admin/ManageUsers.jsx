import { useCallback, useEffect, useState } from 'react';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { errMsg, formatDate } from '../../utils/helpers';

const empty = { full_name: '', username: '', email: '', password: '', role_id: '' };

export default function ManageUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = useCallback(
    () => api.get('/users', { params: { search } }).then((r) => setUsers(r.data)).finally(() => setLoading(false)),
    [search]
  );
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.get('/roles').then((r) => {
      setRoles(r.data);
      setForm((f) => ({ ...f, role_id: r.data.find((x) => x.role_name === 'Subscriber')?.role_id || '' }));
    });
  }, []);

  const run = async (fn, okText) => {
    try {
      await fn();
      setMsg({ type: 'ok', text: okText });
      load();
      return true;
    } catch (e) {
      setMsg({ type: 'err', text: errMsg(e) });
      return false;
    }
  };

  const create = async (e) => {
    e.preventDefault();
    const ok = await run(() => api.post('/users', form), 'User created');
    if (ok) { setShow(false); setForm({ ...empty, role_id: form.role_id }); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <div className="flex gap-2">
          <input className="input w-56" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-primary whitespace-nowrap" onClick={() => setShow(!show)}>{show ? 'Close' : '+ Add User'}</button>
        </div>
      </div>

      {msg.text && (
        <p className={`mb-4 rounded p-2 text-sm ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>
      )}

      {show && (
        <form onSubmit={create} className="card mb-6 grid gap-3 p-4 sm:grid-cols-2">
          <input className="input" placeholder="Full name" value={form.full_name} onChange={set('full_name')} required />
          <input className="input" placeholder="Username" value={form.username} onChange={set('username')} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={set('password')} required />
          <select className="input" value={form.role_id} onChange={set('role_id')}>
            {roles.map((r) => <option key={r.role_id} value={r.role_id}>{r.role_name}</option>)}
          </select>
          <button className="btn-primary">Create user</button>
        </form>
      )}

      {loading ? <Loader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Status</th>
                <th className="p-3">Joined</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const self = u.user_id === me.user_id;
                return (
                  <tr key={u.user_id} className="border-t">
                    <td className="p-3">
                      <p className="font-medium">{u.full_name}</p>
                      <p className="text-xs text-gray-500">@{u.username} • {u.email}</p>
                    </td>
                    <td className="p-3">
                      <select className="input w-36" value={u.role_id} disabled={self}
                        onChange={(e) => run(() => api.put(`/users/${u.user_id}/role`, { role_id: e.target.value }), 'Role updated')}>
                        {roles.map((r) => <option key={r.role_id} value={r.role_id}>{r.role_name}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <span className={`rounded px-2 py-0.5 text-xs ${u.is_blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {u.is_blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">{formatDate(u.created_at)}</td>
                    <td className="p-3">
                      {self ? <span className="text-xs text-gray-400">You</span> : (
                        <div className="flex gap-3">
                          <button className="text-yellow-700 hover:underline"
                            onClick={() => run(() => api.put(`/users/${u.user_id}/block`), u.is_blocked ? 'User unblocked' : 'User blocked')}>
                            {u.is_blocked ? 'Unblock' : 'Block'}
                          </button>
                          <button className="text-red-600 hover:underline"
                            onClick={() => confirm(`Delete ${u.full_name}? Their posts will be deleted too.`) && run(() => api.delete(`/users/${u.user_id}`), 'User deleted')}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}