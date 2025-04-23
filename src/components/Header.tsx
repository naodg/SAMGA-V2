// src/components/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // CSS 따로 분리

export default function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-inner">
        {/* 로고 */}
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img
            src="/img/logo/logo3.jpg"
            alt="로고"
            style={{
              height: '40px', // 원하는 높이
              objectFit: 'contain'
            }}
          />
        </div>

        {/* 메뉴 */}
        <nav className="nav">
          <ul className="nav-list">
            <li
              className="dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              우리마을 소개
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li>브랜드 스토리</li>
                  <li>굿즈몰</li>
                  <li>주변 관광지</li>
                </ul>
              )}
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/storefilterpage')}>
              삼가한우식육식당
            </li>
            <li>리뷰 쓰기</li>
          </ul>
        </nav>

        {/* 유저 메뉴 */}
        <div className="user-menu">
          <span>로그인</span>
          <span>회원가입</span>
          <span>마이페이지</span>
        </div>
      </div>
    </header>
  );
}
