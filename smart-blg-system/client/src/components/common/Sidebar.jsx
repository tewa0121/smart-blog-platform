import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const menus = {
  Admin: [
    ['Dashboard', '/dashboard'], ['Manage Users', '/dashboard/users'], ['Manage Roles', '/dashboard/roles'],
    ['All Posts', '/dashboard/all-posts'], ['Reports', '/dashboard/reports'], ['Settings', '/dashboard/settings'],
    ['Notifications', '/dashboard/notifications'], ['Profile', '/dashboard/profile'],
  ],
  Editor: [
    ['Dashboard', '/dashboard'], ['Review Queue', '/dashboard/review'], ['All Posts', '/dashboard/all-posts'],
    ['Create Post', '/dashboard/create-post'], ['Notifications', '/dashboard/notifications'], ['Profile', '/dashboard/profile'],
  ],
  Author: [
    ['Dashboard', '/dashboard'], ['Create Post', '/dashboard/create-post'], ['My Posts', '/dashboard/my-posts'],
    ['Notifications', '/dashboard/notifications'], ['Profile', '/dashboard/profile'],
  ],
  Contributor: [
    ['Dashboard', '/dashboard'], ['Submit Post', '/dashboard/create-post'], ['My Drafts', '/dashboard/my-posts'],
    ['Notifications', '/dashboard/notifications'], ['Profile', '/dashboard/profile'],
  ],
  Subscriber: [
    ['Dashboard', '/dashboard'], ['My Comments', '/dashboard/my-comments'],
    ['Notifications', '/dashboard/notifications'], ['Profile', '/dashboard/profile'],
  ],
};

const icons = {
  Dashboard: '🏠', 'Manage Users': '👥', 'Manage Roles': '🛡️', 'All Posts': '📚', Reports: '📊',
  Settings: '⚙️', Notifications: '🔔', Profile: '👤', 'Review Queue': '📝', 'Create Post': '✍️',
  'Submit Post': '✍️', 'My Posts': '📄', 'My Drafts': '🗂️', 'My Comments': '💬',
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 shrink-0 flex-col bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl transition-transform duration-200 md:sticky md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link to="/home" className="flex items-center gap-2 border-b border-white/10 px-5 py-5 text-xl font-bold">
          📝 Smart Blog
        </Link>

        <div className="border-b border-white/10 px-5 py-4">
          <p className="truncate font-semibold">{user.full_name}</p>
          <span className="mt-1 inline-block rounded-full bg-white/15 px-2 py-0.5 text-xs">{user.role}</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {(menus[user.role] || []).map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-white text-indigo-800 shadow' : 'text-indigo-100 hover:bg-white/10'
                }`
              }
            >
              <span>{icons[label] || '•'}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-200 hover:bg-red-500/20"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}