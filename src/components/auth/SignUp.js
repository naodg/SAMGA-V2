import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/SignUp.tsx
import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./SignUp.css";
import { useEffect } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";
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
    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init("d65716a4db9e8a93aaff1dfc09ee36b8"); // ← 실제 키 넣어줘
        }
    }, []);
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
    const handleKakaoLogin = () => {
        window.Kakao.Auth.login({
            success: async () => {
                try {
                    const res = await window.Kakao.API.request({ url: "/v2/user/me" });
                    const kakaoId = res.id;
                    const email = res.kakao_account.email || "";
                    const nickname = res.kakao_account.profile.nickname || "카카오유저";
                    // 🔥 1. 서버에서 Firebase Custom Token 발급 (예원 Functions 기준)
                    const firebaseToken = await fetch(`/api/kakao-login?uid=${kakaoId}`).then(res => res.text());
                    // 🔥 2. Firebase 로그인
                    const auth = getAuth();
                    await signInWithCustomToken(auth, firebaseToken);
                    const user = auth.currentUser;
                    if (!user) {
                        alert("Firebase 로그인 실패");
                        return;
                    }
                    // 🔥 3. Firestore에 회원 정보 저장
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (!userSnap.exists()) {
                        await setDoc(userRef, {
                            email,
                            nickname,
                            phone: "", // 카카오는 전화번호 안 줘서 비워둠
                            role: "user",
                            createdAt: new Date()
                        });
                    }
                    alert(`${nickname}님, 카카오 로그인 완료!`);
                }
                catch (err) {
                    console.error("카카오 로그인 실패:", err);
                    alert("카카오 로그인 중 오류 발생");
                }
            },
            fail: (err) => {
                console.error("카카오 로그인 실패:", err);
                alert("카카오 로그인에 실패했어요.");
            }
        });
    };
    return (_jsx("div", { className: "signup-page", children: _jsxs("div", { className: "signup-wrapper", children: [_jsx("div", { className: "signup-text", children: "\uD68C\uC6D0\uAC00\uC785" }), _jsxs("form", { onSubmit: handleSignUp, children: [_jsx("input", { type: "text", placeholder: "\uBCF8\uC778 \uC774\uB984", value: nickname, onChange: (e) => setNickname(e.target.value), required: true }), _jsx("br", {}), _jsx("input", { type: "email", placeholder: "\uC774\uBA54\uC77C", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("br", {}), _jsx("input", { type: "password", placeholder: "\uBE44\uBC00\uBC88\uD638", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("br", {}), _jsx("input", { type: "text", placeholder: "\uC804\uD654\uBC88\uD638 - \uC81C\uC678\uD6C4 \uC785\uB825\uD574\uC8FC\uC138\uC694", value: phone, onChange: (e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                setPhone(formatted);
                                validatePhone(formatted);
                            }, required: true }), _jsx("br", {}), phoneError && _jsx("p", { style: { color: "red" }, children: phoneError }), _jsx("button", { type: "submit", children: "\uD68C\uC6D0\uAC00\uC785" })] }), error && _jsx("p", { style: { color: "red" }, children: error }), success && _jsx("p", { style: { color: "green" }, children: success })] }) }));
}
