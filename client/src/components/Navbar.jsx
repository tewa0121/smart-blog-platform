// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">📝 Smart Blog</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span>👋 {user.name}</span>
              <Link to="/create" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">+ New Post</Link>
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;