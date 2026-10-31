import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Avatar from '../components/common/Avatar';
import NotificationBell from '../components/notifications/NotificationBell';

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white px-4 py-3">
          <button className="text-2xl md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
          <Link to="/home" className="text-sm font-medium text-indigo-600 hover:underline">← View blog</Link>

          <div className="ml-auto flex items-center gap-4">
            <NotificationBell />
            <Avatar to="/dashboard/profile" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}