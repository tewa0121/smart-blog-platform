import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const rows = [
  ['Read posts', 1, 1, 1, 1, 1],
  ['Write posts', 1, 1, 1, 1, 0],
  ['Publish', 1, 1, 1, 0, 0],
  ["Edit others' posts", 1, 1, 0, 0, 0],
  ['Manage users', 1, 0, 0, 0, 0],
  ['System settings', 1, 0, 0, 0, 0],
];

export default function ManageRoles() {
  const [roles, setRoles] = useState(null);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    api.get('/roles').then((r) => setRoles(r.data));
    api.get('/reports').then((r) => setCounts(Object.fromEntries(r.data.usersByRole.map((x) => [x.role_name, x.count]))));
  }, []);

  if (!roles) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Roles</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map((r) => (
          <div key={r.role_id} className="card p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{r.role_name}</h3>
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{counts[r.role_name] ?? 0} users</span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{r.description}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-center text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="p-3 text-left">Permission</th>
              {['Admin', 'Editor', 'Author', 'Contributor', 'Subscriber'].map((n) => <th key={n} className="p-3">{n}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, ...v]) => (
              <tr key={label} className="border-t">
                <td className="p-3 text-left">{label}</td>
                {v.map((x, i) => <td key={i} className={`p-3 ${x ? 'text-green-600' : 'text-red-400'}`}>{x ? '✓' : '✗'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">To change a user's role, go to Manage Users.</p>
    </div>
  );
}