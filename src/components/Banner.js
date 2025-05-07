import React, { useContext } from 'react';
import './Banner.css';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

const Banner = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <div className="banner">
      <BannerTitle onClick={() => navigate('/')}>
        <span className="banner-logo">Dev</span><span className="banner-news">News</span>
      </BannerTitle>
      <div className="banner-menu">
        <a href="#" className="banner-link" onClick={() => navigate('/company')}>기업 블로그 모아보기</a>
        <a href="#" className="banner-link" onClick={() => navigate('/news')}>기술 뉴스 모아보기</a>
      </div>
      <div className="banner-auth">
        {user && user.username ? (
          <span className="banner-hello">{user.username} 님 안녕하세요.</span>
        ) : (
          <>
            <button className="banner-login" onClick={() => navigate('/login')}>로그인</button>
            <span className="banner-divider">|</span>
            <button className="banner-signup" onClick={() => navigate('/join')}>회원가입</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Banner; 

const BannerTitle = styled.div`
  font-size: 2.2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    cursor: pointer;
`
