import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Avatar from './Avatar';
import NotificationBell from '../notifications/NotificationBell';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const search = (e) => {
    e.preventDefault();
    navigate(`/home?search=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="sticky top-0 z-20 border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link to="/home" className="text-xl font-bold text-indigo-600">Smart Blog</Link>

        <form onSubmit={search} className="mx-auto flex w-full max-w-sm flex-1">
          <input className="input" placeholder="Search posts..." value={q} onChange={(e) => setQ(e.target.value)} />
        </form>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <Avatar to="/dashboard" />
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}