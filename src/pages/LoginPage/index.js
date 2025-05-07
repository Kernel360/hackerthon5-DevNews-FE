import React, { useState, useContext } from 'react';
import api from '../../api/axio';
import './LoginPage.css';
import { UserContext } from '../../App';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/login', { username, password });
      if (res.data.code === 1) {
        // 토큰 저장 및 axios 인스턴스에 헤더 설정
        const token = res.headers['authorization'] || res.headers['Authorization'];
        if (token) {
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = token;
        }
        // username 저장 및 전역 상태 갱신
        localStorage.setItem('username', res.data.data.username);
        setUser({ username: res.data.data.username });
        // 로그인 성공 후 이동 (예: 메인 페이지)
        window.location.href = '/';
      } else {
        setError(res.data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  // 페이지 진입 시 토큰이 있으면 axios에 자동 세팅
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = token;
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">로그인</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">이메일</label>
          <input
            className="login-input"
            type="text"
            placeholder="이메일"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <label className="login-label">비밀번호</label>
          <input
            className="login-input"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="login-submit-btn" type="submit">로그인</button>
        </form>
        {error && <div className="login-error" style={{ color: '#e74c3c', marginTop: '12px', fontWeight: 500 }}>{error}</div>}
        <div className="login-bottom">
          아직 DevNews 회원이 아니신가요? <span className="login-divider">|</span> <a href="/join" className="login-join-link">회원가입하기</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;