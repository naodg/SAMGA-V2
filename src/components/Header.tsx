// src/components/Header.tsx
import React, { useState } from 'react';
import { useNavigate,useLocation  } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // ✅ 메뉴 열기/닫기 상태 추가
  const location = useLocation();

  const isStoreDetailPage = location.pathname.startsWith('/store/');

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <header className={isStoreDetailPage ? 'header white' : 'header'}>
      <div className="header-inner-pc">

        {/* 로고 */}
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/img/logo/logo.svg" alt="로고" className='logo' />
        </div>

        {/* 네비게이션 */}
        <nav className="nav">
          <ul className="nav-list">
            {/* <li onClick={() => navigate('/about')}>牛리마을 소개</li> */}
            <li >牛리마을 소개</li>
            <li onClick={() => navigate('/storefilterpage')}>식육식당</li>
            {/* <li onClick={() => navigate('/review')}>리뷰 쓰기</li> */}
            <li>리뷰 쓰기</li>
          </ul>
        </nav>

        {/* 유저 메뉴 */}
        <div className="user-menu">
          {/* <span onClick={() => navigate('/login')}>로그인</span>
          <span onClick={() => navigate('/signup')}>회원가입</span>
          <span onClick={() => navigate('/mypage')}>마이페이지</span> */}
          <span>로그인</span>
          <span>회원가입</span>
          <span>마이페이지</span>
        </div>


      </div>



      {/* 헤더 모바일  */}
      <div className="header-inner-m">
        <div className="top-row">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="/img/logo/logo.svg" alt="로고" className='logo' />
          </div>
          <div className="mobile-menu-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>


        <div className={`mobile-user-menu ${menuOpen ? 'open' : ''}`}>
          <span >로그인</span>
          <span>회원가입</span>
          <span >마이페이지</span>
        </div>


        <nav className="nav">
          <ul className="nav-list">
            <li>소개</li>
            <li>식육식당</li>
            <li>리뷰쓰기</li>
          </ul>
        </nav>



      </div>


    </header>
  );
}
