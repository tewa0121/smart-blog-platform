import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('') || '?';

// Circle with initials. Hover shows the full name and role.
export default function Avatar({ to = '/dashboard/profile' }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Link
      to={to}
      title={`${user.full_name} (${user.role})`}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white ring-2 ring-indigo-100 transition hover:bg-indigo-700"
    >
      {initials(user.full_name)}
    </Link>
  );
}