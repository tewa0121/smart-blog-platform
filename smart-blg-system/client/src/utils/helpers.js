export const imgUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}${path}` : null);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const errMsg = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

export const statusColor = {
  Draft: 'bg-gray-100 text-gray-700',
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-blue-100 text-blue-800',
  Rejected: 'bg-red-100 text-red-800',
  Published: 'bg-green-100 text-green-800',
};