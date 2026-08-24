import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatingTags, setGeneratingTags] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data.post);
    } catch (error) {
      console.error('Failed to fetch post', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleGenerateSummary = async () => {
    if (!token) return;
    setGeneratingSummary(true);
    try {
      await api.post(`/posts/${id}/summarize`);
      await fetchPost();
    } catch (error) {
      console.error('Summarization failed', error);
      alert('Failed to generate summary. Make sure your Groq API key is set.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!token) return;
    setGeneratingTags(true);
    try {
      await api.post(`/posts/${id}/tags`);
      await fetchPost();
    } catch (error) {
      console.error('Tag generation failed', error);
      alert('Failed to generate tags. Make sure your Groq API key is set.');
    } finally {
      setGeneratingTags(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete post');
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

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">Post not found</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to home
        </Link>
      </div>
    );
  }

  const isAuthor = user && post.author_id === user.id;

  return (
    <div className="post-detail-container fade-in">
      <h1 className="post-detail-title">{post.title}</h1>
      
      <div className="post-detail-meta">
        By <strong>{post.author_name}</strong>
        • {new Date(post.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>

      {isAuthor && (
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to={`/edit/${post.id}`} className="action-btn action-btn-edit">
            ✏️ Edit
          </Link>
          <button onClick={handleDelete} className="action-btn action-btn-delete">
            🗑️ Delete
          </button>
          <button
            onClick={handleGenerateSummary}
            disabled={generatingSummary}
            className="action-btn action-btn-ai"
          >
            {generatingSummary ? '⏳ Generating...' : '🤖 AI Summary'}
          </button>
          <button
            onClick={handleGenerateTags}
            disabled={generatingTags}
            className="action-btn action-btn-tags"
          >
            {generatingTags ? '⏳ Generating...' : '🏷️ AI Tags'}
          </button>
        </div>
      )}

      {post.summary && (
        <div className="ai-summary-box">
          <strong>📌 AI Summary:</strong> {post.summary}
        </div>
      )}

      {post.tags && (
        <div className="tags-container">
          {post.tags.split(',').map((tag, i) => (
            <span key={i} className="tag">#{tag.trim()}</span>
          ))}
        </div>
      )}

      <div className="post-detail-content">
        {post.content}
      </div>
    </div>
  );
};

export default PostDetail;