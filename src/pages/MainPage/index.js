import React, { useEffect, useState } from 'react';
import api from '../../api/axio';
import useLikeState from '../../hooks/useLikeState';
import '../CompanyPage/CompanyPage.css';

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeStates, toggleLike] = useLikeState(posts);

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

  return (
    <div className="company-page-container">
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
