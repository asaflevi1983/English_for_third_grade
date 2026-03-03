import { useState, useEffect } from 'react';
import './CommunityBoard.css';

const REPO_OWNER = 'asaflevi1983';
const REPO_NAME = 'English_for_third_grade';
const POSTS_LABEL = 'community-post';
const API_BASE = 'https://api.github.com';

function CommunityBoard({ onBack }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const response = await fetch(
        `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=${POSTS_LABEL}&state=open&per_page=50&sort=created&direction=desc`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );
      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('CommunityBoard: failed to load posts', err);
      setLoadError('לא הצלחנו לטעון את הפוסטים. נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const issueBody = authorName.trim()
        ? `**מאת:** ${authorName.trim()}\n\n${message.trim()}`
        : message.trim();

      const response = await fetch(
        `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            title: title.trim(),
            body: issueBody,
            labels: [POSTS_LABEL],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }

      const newPost = await response.json();
      setPosts((prev) => [newPost, ...prev]);
      setTitle('');
      setMessage('');
      setAuthorName('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error('CommunityBoard: failed to submit post', err);
      setSubmitError('לא הצלחנו לשלוח את הפוסט. נסה שוב מאוחר יותר.');
    } finally {
      setSubmitting(false);
    }
  };

  const parseAuthor = (body) => {
    if (!body) return null;
    const match = body.match(/^\*\*מאת:\*\* (.+)/);
    return match ? match[1] : null;
  };

  const parseBody = (body) => {
    if (!body) return '';
    return body.replace(/^\*\*מאת:\*\* .+\n\n?/, '').trim();
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="community-board">
      <button className="back" onClick={onBack}>
        ← חזור
      </button>

      <div className="board-header">
        <h1>💬 לוח המסרים של הכיתה 💬</h1>
        <p className="board-subtitle">שתפו הישגים, שאלות ומסרים לחברי הכיתה!</p>
      </div>

      <div className="create-post-section">
        <h2>✍️ כתבו פוסט חדש</h2>
        <form className="post-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-input"
            placeholder="השם שלכם (אופציונלי)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={50}
          />
          <input
            type="text"
            className="form-input"
            placeholder="כותרת ההודעה *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
          <textarea
            className="form-textarea"
            placeholder="כתבו את ההודעה שלכם כאן... *"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
            required
          />
          <div className="form-actions">
            <span className="char-count">{message.length} / 500</span>
            <button
              type="submit"
              className="primary submit-btn"
              disabled={submitting || !title.trim() || !message.trim()}
            >
              {submitting ? '⏳ שולח...' : '📤 שלח פוסט'}
            </button>
          </div>
          {submitError && <div className="form-error">{submitError}</div>}
          {submitSuccess && (
            <div className="form-success">✅ הפוסט נשלח בהצלחה!</div>
          )}
        </form>
      </div>

      <div className="posts-section">
        <h2>📋 פוסטים אחרונים</h2>
        {loading ? (
          <div className="posts-loading">
            <div className="loading-spinner">🔄</div>
            <p>טוען פוסטים...</p>
          </div>
        ) : loadError ? (
          <div className="posts-error">
            <p>{loadError}</p>
            <button className="primary" onClick={loadPosts}>
              🔄 נסה שוב
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">📝</div>
            <p>אין פוסטים עדיין. היו הראשונים לכתוב!</p>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => {
              const author = parseAuthor(post.body);
              const body = parseBody(post.body);
              return (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <h3 className="post-title">💬 {post.title}</h3>
                    <span className="post-date">{formatDate(post.created_at)}</span>
                  </div>
                  {body && <p className="post-body">{body}</p>}
                  {author && (
                    <div className="post-author">✍️ {author}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityBoard;
