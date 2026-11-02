import { Link, Outlet } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 py-10">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <div className="w-full max-w-md">
        <Link to="/" className="mb-4 inline-block text-sm text-indigo-600 hover:underline">← Back to home</Link>
        <Outlet />
      </div>
    </div>
  );
}