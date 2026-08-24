import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="navbar-brand">
          📝 <span>Smart</span> Blog
        </Link>
        <div className="flex gap-4 items-center navbar-links">
          {user ? (
            <>
              <span className="text-white font-medium">👋 {user.name}</span>
              <Link to="/create" className="navbar-btn navbar-btn-success">
                + New Post
              </Link>
              <button onClick={logout} className="navbar-btn navbar-btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200 transition">
                Login
              </Link>
              <Link to="/register" className="navbar-btn navbar-btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;