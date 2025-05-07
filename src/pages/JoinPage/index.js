import api from '../../api/axio';
import './JoinPage.css';
import { useState } from 'react';

const categories = [
  '백엔드', '웹 프론트엔드', '클라우드 / 인프라', '데이터 분석', 'AI / 머신러닝', 'DevOps / 툴링',
  '모바일', '언어 / 프로그래밍', '보안', '개발 문화 / 커리어'
];

const companies = [
  'AWS', '올리브영', '토스', '마이리얼트립', '구글디벨로퍼스',
  '카카오', '카카오 페이', '가비아', '데보션', '당근마켓'
];

const JoinPage = ({ onJoinResult, joinError }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const handleCategoryClick = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleCompanyClick = (com) => {
    setSelectedCompanies((prev) =>
      prev.includes(com) ? prev.filter((c) => c !== com) : [...prev, com]
    );
  };

  const isPasswordMatch = password && passwordCheck && password === passwordCheck;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordMatch) return;
    try {
      const res = await api.post('/api/join', {
        username,
        email,
        password,
        categories: selectedCategories,
        companies: selectedCompanies
      });
      onJoinResult(res.data, { username, email });
    } catch (err) {
      onJoinResult(err.response?.data || { code: -1, message: '회원가입 중 오류가 발생했습니다.' }, {});
    }
  };

  return (
    <div className="join-container">
      <div className="join-box">
        <div className="join-title">회원가입</div>
        <div className="join-desc">가입을 통해 다양한 IT 소식을 받아보세요!</div>
        <form className="join-form" onSubmit={handleSubmit}>
          <label className="join-label">이름</label>
          <input className="join-input" type="text" placeholder="홍길동" value={username} onChange={e => setUsername(e.target.value)} />

          <label className="join-label">이메일</label>
          <input className="join-input" type="email" placeholder="abc000@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />

          <label className="join-label">비밀번호</label>
          <input className="join-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />

          <label className="join-label">비밀번호 확인</label>
          <input className="join-input" type="password" value={passwordCheck} onChange={e => setPasswordCheck(e.target.value)} />
          {!isPasswordMatch && passwordCheck && (
            <div style={{ color: '#e74c3c', fontSize: '0.95rem', marginTop: '-8px', marginBottom: '4px' }}>
              비밀번호가 일치하지 않습니다.
            </div>
          )}

          <hr className="join-divider" />

          <div className="join-section-title">관심 있는 분야</div>
          <div className="join-category-list">
            {categories.map((cat, idx) => (
              <button
                type="button"
                className={`join-category-btn${selectedCategories.includes(cat) ? ' selected' : ''}`}
                key={cat+idx}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="join-section-title">관심 있는 기업</div>
          <div className="join-company-list">
            {companies.map((com, idx) => (
              <button
                type="button"
                className={`join-company-btn${selectedCompanies.includes(com) ? ' selected' : ''}`}
                key={com+idx}
                onClick={() => handleCompanyClick(com)}
              >
                {com}
              </button>
            ))}
          </div>

          <button className="join-submit-btn" type="submit" disabled={!isPasswordMatch}>회원가입</button>
        </form>
        {joinError && (
          <div className="join-error" style={{ color: '#e74c3c', marginTop: '12px', fontWeight: 500 }}>
            {joinError}
          </div>
        )}
      </div>
    </div>
  );
};

// 컨테이너 컴포넌트
const JoinPageContainer = () => {
  const [joinResult, setJoinResult] = useState(null); // { code, message, data }
  const [formData, setFormData] = useState({});

  const handleJoinResult = (result, form) => {
    if (result.code === 1) {
      setJoinResult(result);
      setFormData(form);
    } else if (result.code === -1) {
      // 실패 시 joinResult는 그대로 두고, joinError만 전달
      setJoinResult({ code: 0, message: result.message });
    }
  };

  if (joinResult && joinResult.code === 1) {
    // 회원가입 성공 화면
    return (
      <div className="join-container">
        <div className="join-box" style={{ alignItems: 'center' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: 8 }}>회원가입이 완료되었습니다 !</div>
          <div style={{ marginBottom: 24, color: '#444', fontSize: '1rem' }}>
            환영합니다. 로그인 후 서비스를 이용하실 수 있습니다.
          </div>
          <div style={{ border: '1px solid #bbb', borderRadius: 8, padding: 24, marginBottom: 24, background: '#fff' }}>
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <div style={{ width: 60, color: '#888' }}>이름</div>
              <div style={{ fontWeight: 500 }}>{joinResult.data.username}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ width: 60, color: '#888' }}>아이디</div>
              <div style={{ fontWeight: 500 }}>{formData.email}</div>
            </div>
          </div>
          <button className="join-submit-btn" style={{ width: 320 }} onClick={() => window.location.href = '/login'}>
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  // 실패 시 joinError만 전달, 폼은 그대로 유지
  return <JoinPage onJoinResult={handleJoinResult} joinError={joinResult && joinResult.code === 0 ? joinResult.message : null} />;
};

export default JoinPageContainer;
