// src/components/PostCard.jsx
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="border rounded-lg p-6 shadow hover:shadow-lg transition">
      <Link to={`/post/${post.id}`}>
        <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">{post.title}</h2>
      </Link>
      <p className="text-gray-600 mb-2">
        By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
      </p>
      {post.summary && (
        <p className="text-gray-700 mb-2">📌 {post.summary}</p>
      )}
      {post.tags && (
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.split(',').map((tag, i) => (
            <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
      <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline">Read more →</Link>
    </div>
  );
};

export default PostCard;