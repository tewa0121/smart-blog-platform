import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold text-indigo-600">404</h1>
      <p className="mt-2 text-gray-600">Page not found or not built yet.</p>
      <Link to="/" className="btn-primary mt-6">Go Home</Link>
    </div>
  );
}