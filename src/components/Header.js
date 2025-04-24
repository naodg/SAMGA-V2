import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Header.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // CSS 따로 분리
export default function Header() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    return (_jsx("header", { className: "header", children: _jsxs("div", { className: "header-inner", children: [_jsx("div", { className: "logo", style: { cursor: 'pointer' }, onClick: () => navigate('/'), children: _jsx("img", { src: "/img/logo/logo3.jpg", alt: "\uB85C\uACE0", style: {
                            height: '40px', // 원하는 높이
                            objectFit: 'contain'
                        } }) }), _jsx("nav", { className: "nav", children: _jsxs("ul", { className: "nav-list", children: [_jsxs("li", { className: "dropdown", onMouseEnter: () => setDropdownOpen(true), onMouseLeave: () => setDropdownOpen(false), children: ["\uC6B0\uB9AC\uB9C8\uC744 \uC18C\uAC1C", isDropdownOpen && (_jsxs("ul", { className: "dropdown-menu", children: [_jsx("li", { children: "\uBE0C\uB79C\uB4DC \uC2A4\uD1A0\uB9AC" }), _jsx("li", { children: "\uAD7F\uC988\uBAB0" }), _jsx("li", { children: "\uC8FC\uBCC0 \uAD00\uAD11\uC9C0" })] }))] }), _jsx("li", { style: { cursor: 'pointer' }, onClick: () => navigate('/storefilterpage'), children: "\uC0BC\uAC00\uD55C\uC6B0\uC2DD\uC721\uC2DD\uB2F9" }), _jsx("li", { children: "\uB9AC\uBDF0 \uC4F0\uAE30" })] }) }), _jsxs("div", { className: "user-menu", children: [_jsx("span", { children: "\uB85C\uADF8\uC778" }), _jsx("span", { children: "\uD68C\uC6D0\uAC00\uC785" }), _jsx("span", { children: "\uB9C8\uC774\uD398\uC774\uC9C0" })] })] }) }));
}
