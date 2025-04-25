// src/components/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-inner">

        {/* 로고 */}
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/img/logo/logo.svg" alt="로고" style={{ height: '80px' }} />
        </div>

        {/* 네비게이션 */}
        <nav className="nav">
          <ul className="nav-list">
            <li onClick={() => navigate('/about')}>牛리마을 소개</li>
            <li onClick={() => navigate('/storefilterpage')}>식육식당</li>
            <li onClick={() => navigate('/review')}>리뷰 쓰기</li>
          </ul>
        </nav>

        {/* 유저 메뉴 */}
        <div className="user-menu">
          <span onClick={() => navigate('/login')}>로그인</span>
          <span onClick={() => navigate('/signup')}>회원가입</span>
          <span onClick={() => navigate('/mypage')}>마이페이지</span>
        </div>
      </div>
    </header>
  );
}
