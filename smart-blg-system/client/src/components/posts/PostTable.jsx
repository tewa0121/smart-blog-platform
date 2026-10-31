import { formatDate, statusColor } from '../../utils/helpers';

export default function PostTable({ posts, showAuthor = false, renderActions }) {
  if (!posts.length) return <p className="card p-6 text-center text-gray-500">No posts found.</p>;

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="p-3">Title</th>
            {showAuthor && <th className="p-3">Author</th>}
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Updated</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.post_id} className="border-t align-top">
              <td className="p-3">
                <p className="font-medium">{p.title}</p>
                {p.status === 'Rejected' && p.reviewer_note && (
                  <p className="mt-1 text-xs text-red-600">Editor note: {p.reviewer_note}</p>
                )}
              </td>
              {showAuthor && <td className="p-3">{p.author}</td>}
              <td className="p-3">{p.category_name || '-'}</td>
              <td className="p-3">
                <span className={`rounded px-2 py-0.5 text-xs ${statusColor[p.status]}`}>{p.status}</span>
              </td>
              <td className="p-3 whitespace-nowrap">{formatDate(p.updated_at)}</td>
              <td className="p-3">
                <div className="flex flex-wrap items-center gap-3">{renderActions(p)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}