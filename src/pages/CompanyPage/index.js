import React, { useState, useEffect } from 'react';
import './CompanyPage.css';
import api from '../../api/axio';
import useLikeState from '../../hooks/useLikeState';

const PAGE_SIZE = 7;
const PAGINATION_GROUP_SIZE = 7;

const CATEGORY_OPTIONS = [
  "백엔드", "웹 프론트엔드", "클라우드 / 인프라", "데이터분석",
  "AI / 머신러닝", "DevOps", "모바일", "언어 / 프로그래밍",
  "보안", "개발 문화 / 커리어"
];

const COMPANY_OPTIONS = [
    "카카오", "AWS", "토스", "라인", "올리브영",
    "마켓컬리", "네이버", "카카오 모빌리티", "당근마켓", "여기어떄",
    "가비아", "한글과 컴퓨터", "우아한 형제들"
]; 
function getPaginationGroup(currentGroup, total) {
  const groupSize = PAGINATION_GROUP_SIZE;
  const start = (currentGroup - 1) * groupSize + 1;
  const end = Math.min(start + groupSize - 1, total);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const Pagination = ({ current, total, onChange, group, setGroup }) => {
  const groupSize = PAGINATION_GROUP_SIZE;
  const totalGroups = Math.ceil(total / groupSize);
  const pages = getPaginationGroup(group, total);

  const handlePrevGroup = () => {
    if (group > 1) setGroup(group - 1);
  };
  const handleNextGroup = () => {
    if (group < totalGroups) setGroup(group + 1);
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-arrow"
        onClick={handlePrevGroup}
        disabled={group === 1}
      >
        &#60;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-page${current === page ? ' active' : ''}`}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="pagination-arrow"
        onClick={handleNextGroup}
        disabled={group === totalGroups}
      >
        &#62;
      </button>
    </div>
  );
};

const CompanyPage = () => {
  const [page, setPage] = useState(1); // 1-based
  const [group, setGroup] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const groupSize = PAGINATION_GROUP_SIZE;

  const [likeStates, toggleLike] = useLikeState(posts);

  // API 호출
  useEffect(() => {
    let url = '/api/article';
    if (selectedCompany && selectedCategory) url = '/api/article/category-company';
    else if (selectedCompany) url = '/api/article/company';
    else if (selectedCategory) url = '/api/article/category';

    const params = {
      companyName: selectedCompany || undefined,
      category: selectedCategory || undefined,
      page: page - 1,
      count: PAGE_SIZE,
      type: '테크 블로그',
    };

    const fetchData = async () => {
      try {
        const res = await api.get(url, { params });
        setPosts(res.data.articles || []);
        setTotalPages(res.data.page || 1);
      } catch (e) {
        setPosts([]);
        setTotalPages(1);
      }
    };
    fetchData();
  }, [page, selectedCompany, selectedCategory]);

  // 그룹이 바뀌면 해당 그룹의 첫 페이지로 이동
  const handleSetGroup = (g) => {
    setGroup(g);
    setPage((g - 1) * groupSize + 1);
  };

  // 페이지를 바꿀 때, 그룹 범위 내에서만 이동
  const handleSetPage = (p) => {
    setPage(p);
  };

  // 필터 변경 시 첫 페이지로 이동
  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setPage(1);
    setGroup(1);
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
    setGroup(1);
  };

  // 그룹이 바뀌어도, 페이지가 그룹 범위 내에 있도록 보정
  useEffect(() => {
    const start = (group - 1) * groupSize + 1;
    const end = Math.min(start + groupSize - 1, totalPages);
    if (page < start || page > end) {
      setPage(start);
    }
    // eslint-disable-next-line
  }, [group, totalPages]);

  return (
    <div className="company-page-container">
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <select value={selectedCompany} onChange={handleCompanyChange} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ccc' }}>
          <option value="">기업명</option>
          {COMPANY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={selectedCategory} onChange={handleCategoryChange} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ccc' }}>
          <option value="">분야</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {posts.map((post, idx) => {
        const id = post.id || idx;
        console.log('렌더링:', id, likeStates[id]);
        // likeStates[id]가 undefined면 아직 로딩 중
        if (!likeStates[id]) {
          return (
            <div key={idx} className="company-post">
              <div className="company-post-header">
                {post.companyLogo ? (
                  <img src={post.companyLogo} alt={post.companyName || ''} className="company-logo" />
                ) : null}
                <span className="company-name">{post.companyName || '알 수 없음'}</span>
              </div>
              <div className="company-post-title">
                {post.title}
              </div>
              <div className="company-post-tag">{post.category}</div>
              <div className="company-post-footer">
                <span className="heart-like loading">🤍</span>
                <span className="company-post-time">{post.publishDate?.slice(0, 10) || ''}</span>
              </div>
            </div>
          );
        }
        const like = likeStates[id];
        return (
          <div
            className="company-post"
            key={idx}
            onClick={() => {
              if (post.url) window.open(post.url, '_blank', 'noopener,noreferrer');
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="company-post-header">
              {post.companyLogo ? (
                <img src={post.companyLogo} alt={post.companyName || ''} className="company-logo" />
              ) : null}
              <span className="company-name">{post.companyName || '알 수 없음'}</span>
            </div>
            <div className="company-post-title">
              {post.title}
            </div>
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
              <span className="company-post-time">{post.publishDate?.slice(0, 10) || ''}</span>
            </div>
          </div>
        );
      })}
      <Pagination
        current={page}
        total={totalPages}
        onChange={handleSetPage}
        group={group}
        setGroup={handleSetGroup}
      />
    </div>
  );
};

export default CompanyPage;
