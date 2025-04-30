import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Header.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
export default function Header() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false); // ✅ 메뉴 열기/닫기 상태 추가
    const location = useLocation();
    const isStoreDetailPage = location.pathname.startsWith('/store/');
    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };
    return (_jsxs("header", { className: isStoreDetailPage ? 'header white' : 'header', children: [_jsxs("div", { className: "header-inner-pc", children: [_jsx("div", { className: "logo", onClick: () => navigate('/'), children: _jsx("img", { src: "/img/logo/logo.svg", alt: "\uB85C\uACE0", className: 'logo' }) }), _jsx("nav", { className: "nav", children: _jsxs("ul", { className: "nav-list", children: [_jsx("li", { onClick: () => navigate('/about'), children: "\u725B\uB9AC\uB9C8\uC744 \uC18C\uAC1C" }), _jsx("li", { onClick: () => navigate('/storefilterpage'), children: "\uC2DD\uC721\uC2DD\uB2F9" }), _jsx("li", { onClick: () => navigate('/review'), children: "\uB9AC\uBDF0 \uC4F0\uAE30" })] }) }), _jsxs("div", { className: "user-menu", children: [_jsx("span", { onClick: () => navigate('/login'), children: "\uB85C\uADF8\uC778" }), _jsx("span", { onClick: () => navigate('/signup'), children: "\uD68C\uC6D0\uAC00\uC785" }), _jsx("span", { onClick: () => navigate('/mypage'), children: "\uB9C8\uC774\uD398\uC774\uC9C0" })] })] }), _jsxs("div", { className: "header-inner-m", children: [_jsxs("div", { className: "top-row", children: [_jsx("div", { className: "logo", onClick: () => navigate('/'), children: _jsx("img", { src: "/img/logo/logo.svg", alt: "\uB85C\uACE0", className: 'logo' }) }), _jsxs("div", { className: "mobile-menu-icon", onClick: toggleMenu, children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] })] }), _jsxs("div", { className: `mobile-user-menu ${menuOpen ? 'open' : ''}`, children: [_jsx("span", { onClick: () => navigate('/login'), children: "\uB85C\uADF8\uC778" }), _jsx("span", { onClick: () => navigate('/signup'), children: "\uD68C\uC6D0\uAC00\uC785" }), _jsx("span", { onClick: () => navigate('/mypage'), children: "\uB9C8\uC774\uD398\uC774\uC9C0" })] }), _jsx("nav", { className: "nav", children: _jsxs("ul", { className: "nav-list", children: [_jsx("li", { children: "\uC18C\uAC1C" }), _jsx("li", { children: "\uC2DD\uC721\uC2DD\uB2F9" }), _jsx("li", { children: "\uB9AC\uBDF0\uC4F0\uAE30" })] }) })] })] }));
}
