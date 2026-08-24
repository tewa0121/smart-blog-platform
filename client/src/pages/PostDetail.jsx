// src/pages/PostDetail.jsx
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
    }
  };

  if (loading) return <div className="text-center py-10">Loading post...</div>;
  if (!post) return <div className="text-center py-10 text-red-500">Post not found</div>;

  const isAuthor = user && post.author_id === user.id;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-4">
        By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
      </p>

      {isAuthor && (
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to={`/edit/${post.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            ✏️ Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            🗑️ Delete
          </button>
          <button
            onClick={handleGenerateSummary}
            disabled={generatingSummary}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {generatingSummary ? '⏳ Generating...' : '🤖 AI Summary'}
          </button>
          <button
            onClick={handleGenerateTags}
            disabled={generatingTags}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {generatingTags ? '⏳ Generating...' : '🏷️ AI Tags'}
          </button>
        </div>
      )}

      {post.summary && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-gray-700"><strong>📌 Summary:</strong> {post.summary}</p>
        </div>
      )}

      {post.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.split(',').map((tag, i) => (
            <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="prose max-w-none bg-white p-6 rounded-lg shadow whitespace-pre-wrap">
        {post.content}
      </div>
    </div>
  );
};

export default PostDetail;