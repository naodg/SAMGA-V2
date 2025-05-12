import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/SignUp.tsx
import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./SignUp.css";
export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const validatePhone = (value) => {
        const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            setPhoneError("전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
        }
        else {
            setPhoneError("");
        }
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        // if (phoneError) {
        //     setError("전화번호 형식을 확인해주세요.")
        //     return
        // }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                email,
                nickname,
                phone,
                role: "user",
                createdAt: new Date()
            });
            await sendEmailVerification(user);
            setSuccess("회원가입이 완료되었습니다! 이메일을 확인해주세요.");
            setEmail("");
            setPassword("");
            setNickname("");
            setPhone("");
        }
        catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("이미 가입된 이메일입니다.");
            }
            else if (err.code === "auth/invalid-email") {
                setError("이메일 형식이 올바르지 않습니다.");
            }
            else if (err.code === "auth/weak-password") {
                setError("비밀번호는 6자리 이상이어야 합니다.");
            }
            else {
                setError("회원가입 중 오류가 발생했습니다.");
            }
        }
    };
    const formatPhoneNumber = (value) => {
        const numbersOnly = value.replace(/\D/g, ""); // 숫자만 남김
        if (numbersOnly.length < 4)
            return numbersOnly;
        if (numbersOnly.length < 7) {
            return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
        }
        if (numbersOnly.length <= 11) {
            return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7)}`;
        }
        return numbersOnly; // 11자리 넘으면 하이픈 없이 그대로
    };
    return (_jsx("div", { className: "signup-page", children: _jsxs("div", { className: "signup-wrapper", children: [_jsx("h2", { className: "signup-text", children: "\uD68C\uC6D0\uAC00\uC785" }), _jsxs("form", { onSubmit: handleSignUp, children: [_jsx("input", { type: "text", placeholder: "\uB2C9\uB124\uC784", value: nickname, onChange: (e) => setNickname(e.target.value), required: true }), _jsx("br", {}), _jsx("input", { type: "email", placeholder: "\uC774\uBA54\uC77C", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("br", {}), _jsx("input", { type: "password", placeholder: "\uBE44\uBC00\uBC88\uD638", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("br", {}), _jsx("input", { type: "text", placeholder: "\uC804\uD654\uBC88\uD638 (\uC608: 010-1234-5678)", value: phone, onChange: (e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                setPhone(formatted);
                                validatePhone(formatted);
                            }, required: true }), _jsx("br", {}), phoneError && _jsx("p", { style: { color: "red" }, children: phoneError }), _jsx("button", { type: "submit", children: "\uD68C\uC6D0\uAC00\uC785" })] }), error && _jsx("p", { style: { color: "red" }, children: error }), success && _jsx("p", { style: { color: "green" }, children: success })] }) }));
}
