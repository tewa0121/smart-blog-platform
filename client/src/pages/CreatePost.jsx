import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/posts', { title, content });
      navigate(`/post/${res.data.post.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
      setLoading(false);
    }
  };

  return (
    <div className="form-container fade-in" style={{ maxWidth: '800px' }}>
      <h2 className="form-title">📝 Create New Post</h2>
      <p className="form-subtitle">Share your thoughts with the world</p>
      
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
        
        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? 'Publishing...' : '🚀 Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;