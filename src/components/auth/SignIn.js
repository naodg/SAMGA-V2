import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/auth/Login.tsx
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/"); // 로그인 후 메인 페이지로 이동
        }
        catch (err) {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    };
    useEffect(() => {
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
            alert("이메일 인증을 완료해주세요.");
            navigate("/"); // 혹은 인증 안내 페이지로 보내기
        }
    }, []);
    return (_jsx("div", { className: "signup-page", children: _jsxs("div", { className: "signup-wrapper", children: [_jsx("h2", { children: "\uB85C\uADF8\uC778" }), _jsxs("form", { onSubmit: handleLogin, children: [_jsx("input", { type: "email", placeholder: "\uC774\uBA54\uC77C", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("br", {}), _jsx("input", { type: "password", placeholder: "\uBE44\uBC00\uBC88\uD638", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("br", {}), _jsx("button", { type: "submit", children: "\uB85C\uADF8\uC778" })] }), error && _jsx("p", { style: { color: "red" }, children: error })] }) }));
}
