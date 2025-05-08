import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axio';
import useLikeState from '../../hooks/useLikeState';
import '../CompanyPage/CompanyPage.css';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeStates, toggleLike] = useLikeState(posts);

  // 인기 Top 5
  const [hotPosts, setHotPosts] = useState([]);
  const [hotLoading, setHotLoading] = useState(true);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/article/new');
        setPosts(res.data.articles || res.data || []);
      } catch (e) {
        setPosts([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchHot = async () => {
      setHotLoading(true);
      try {
        const res = await api.get('/api/article/hot');
        setHotPosts((res.data.articles || res.data || []).slice(0, 5));
      } catch (e) {
        setHotPosts([]);
      }
      setHotLoading(false);
    };
    fetchHot();
  }, []);

  return (
    <div className="company-page-container">
      {/* 실시간 인기 Top 5 */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.3rem', marginBottom: 16 }}>🔥 실시간 인기 Top 5</h2>
        <div>
          {hotLoading ? (
            <div>로딩 중...</div>
          ) : hotPosts.length === 0 ? (
            <div>인기 아티클이 없습니다.</div>
          ) : (
            <ol style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {hotPosts.map((post, idx) => (
                <li
                  key={post.id || idx}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
                    borderBottom: idx !== hotPosts.length - 1 ? '1px solid #f1f1f1' : 'none',
                    cursor: post.url ? 'pointer' : 'default',
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    if (post.url) window.open(post.url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <span style={{
                    fontWeight: 'bold', color: '#e74c3c', fontSize: '1.1rem', minWidth: 24, textAlign: 'center'
                  }}>{idx + 1}</span>
                  <span style={{ color: '#222', fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      {/* 최신 발행된 아티클 */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>New! 최신 발행된 아티클</h2>
      </div>
      {loading ? (
        <div>로딩 중...</div>
      ) : posts.length === 0 ? (
        <div>새로 발행된 글이 없습니다.</div>
      ) : (
        posts.map((post, idx) => {
          const id = post.id || idx;
          const like = likeStates[id] || { isLiked: false, likeCount: post.like || 0, anim: false };
          return (
            <div
              className="company-post"
              key={id}
              onClick={() => {
                if (post.url) window.open(post.url, '_blank', 'noopener,noreferrer');
              }}
              style={{ cursor: post.url ? 'pointer' : 'default' }}
            >
              <div className="company-post-header">
                {post.companyLogo && (
                  <img src={post.companyLogo} alt={post.companyName || ''} className="company-logo" />
                )}
                <span className="company-name">{post.companyName || '알 수 없음'}</span>
              </div>
              <div className="company-post-title">{post.title}</div>
              <div className="company-post-tag">{post.category}</div>
              <div className="company-post-footer">
                <span
                  className={`heart-like${like.isLiked ? ' liked' : ''}${like.anim ? ' pop' : ''}`}
                  onClick={e => {
                    e.stopPropagation();
                    if (!(user && user.username)) {
                      navigate('/login');
                      return;
                    }
                    toggleLike(id, post.id);
                  }}
                >
                  {like.isLiked ? '❤️' : '🤍'} {like.likeCount}
                </span>
                <span className="company-post-time right-time">{post.publishDate?.slice(0, 10) || ''}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MainPage;
