import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('') || '?';

// Circle with initials. Tap it to open a menu: Dashboard, Profile, View blog, Logout.
export default function Avatar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when tapping outside the menu
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, []);

  if (!user) return null;

  const item =
    'block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700';

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white ring-2 ring-indigo-100 transition hover:bg-indigo-700 dark:ring-indigo-900"
      >
        {initials(user.full_name)}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-gray-100 px-4 py-3 dark:border-slate-700">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.full_name}</p>
            <p className="truncate text-xs text-gray-500 dark:text-slate-400">@{user.username}</p>
            <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
              {user.role}
            </span>
          </div>

          <Link to="/dashboard" onClick={() => setOpen(false)} className={item}>🏠 Dashboard</Link>
          <Link to="/dashboard/profile" onClick={() => setOpen(false)} className={item}>👤 Profile</Link>
          <Link to="/home" onClick={() => setOpen(false)} className={item}>📚 View blog</Link>

          <button
            type="button"
            onClick={handleLogout}
            className="block w-full border-t border-gray-100 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:border-slate-700 dark:text-red-300 dark:hover:bg-red-900/30"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}