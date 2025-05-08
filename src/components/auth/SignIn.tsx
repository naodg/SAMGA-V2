// src/components/auth/Login.tsx
import React, { useState,useEffect } from "react"
import { auth } from "../../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import "./SignUp.css"

export default function Signin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/") // 로그인 후 메인 페이지로 이동
        } catch (err: any) {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.")
        }
    }


    useEffect(() => {
        const user = auth.currentUser
        if (user && !user.emailVerified) {
          alert("이메일 인증을 완료해주세요.")
          navigate("/") // 혹은 인증 안내 페이지로 보내기
        }
      }, [])
      

      

    return (
        <div className="signup-page">
            <div className="signup-wrapper">
                <h2>로그인</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">로그인</button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    )
}
