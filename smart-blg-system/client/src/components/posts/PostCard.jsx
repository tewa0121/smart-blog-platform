import { Link } from 'react-router-dom';
import { formatDate, imgUrl } from '../../utils/helpers';

export default function PostCard({ post }) {
  return (
    <article className="card overflow-hidden">
      {post.image ? (
        <img src={imgUrl(post.image)} alt={post.title} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 items-center justify-center bg-indigo-50 text-4xl">📝</div>
      )}
      <div className="p-4">
        {post.category_name && (
          <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{post.category_name}</span>
        )}
        <h3 className="mt-2 text-lg font-semibold">
          <Link to={`/posts/${post.post_id}`} className="hover:text-indigo-600">{post.title}</Link>
        </h3>
        <p className="mt-1 line-clamp-3 text-sm text-gray-600">{post.content}</p>
        <p className="mt-3 text-xs text-gray-500">
          By {post.author} • {formatDate(post.created_at)} • 💬 {post.comment_count}
        </p>
      </div>
    </article>
  );
}