import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setTitle(res.data.post.title);
        setContent(res.data.post.content);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try {
      await api.put(`/posts/${id}`, { title, content });
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading post...</span>
      </div>
    );
  }

  return (
    <div className="form-container fade-in" style={{ maxWidth: '800px' }}>
      <h2 className="form-title">✏️ Edit Post</h2>
      <p className="form-subtitle">Update your blog post</p>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Post Title</label>
          <input
            type="text"
            placeholder="Enter a catchy title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label className="form-label">Content</label>
          <textarea
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-input"
            style={{ minHeight: '300px', resize: 'vertical' }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="form-submit" 
          disabled={updating}
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
        >
          {updating ? 'Updating...' : '💾 Update Post'}
        </button>
      </form>
    </div>
  );
};

export default EditPost;