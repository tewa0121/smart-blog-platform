import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="post-card fade-in">
      <Link to={`/post/${post.id}`}>
        <h2 className="post-card-title">{post.title}</h2>
      </Link>
      <div className="post-card-meta">
        By <span className="author">{post.author_name}</span>
        • {new Date(post.created_at).toLocaleDateString()}
      </div>
      {post.summary && (
        <p className="post-card-summary">📌 {post.summary}</p>
      )}
      {post.tags && (
        <div className="post-card-tags">
          {post.tags.split(',').map((tag, i) => (
            <span key={i} className="post-card-tag">#{tag.trim()}</span>
          ))}
        </div>
      )}
      <Link to={`/post/${post.id}`} className="post-card-link">
        Read more →
      </Link>
    </div>
  );
};

export default PostCard;