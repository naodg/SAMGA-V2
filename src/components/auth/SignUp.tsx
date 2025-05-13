// src/components/SignUp.tsx
import React, { useState } from "react"
import { auth, db } from "../../firebase"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import "./SignUp.css"

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [nickname, setNickname] = useState("")
    const [phone, setPhone] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const validatePhone = (value: string) => {
        const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;

        if (!phoneRegex.test(value)) {
            setPhoneError("전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
        } else {
            setPhoneError("");
        }
    };




    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        // if (phoneError) {
        //     setError("전화번호 형식을 확인해주세요.")
        //     return
        // }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await setDoc(doc(db, "users", user.uid), {
                email,
                nickname,
                phone,
                role: "user",
                createdAt: new Date()
            })

            await sendEmailVerification(user)
            setSuccess("회원가입이 완료되었습니다! 이메일을 확인해주세요.")

            setEmail("")
            setPassword("")
            setNickname("")
            setPhone("")
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") {
                setError("이미 가입된 이메일입니다.")
            } else if (err.code === "auth/invalid-email") {
                setError("이메일 형식이 올바르지 않습니다.")
            } else if (err.code === "auth/weak-password") {
                setError("비밀번호는 6자리 이상이어야 합니다.")
            } else {
                setError("회원가입 중 오류가 발생했습니다.")
            }
        }
    }

    const formatPhoneNumber = (value: string) => {
        const numbersOnly = value.replace(/\D/g, "") // 숫자만 남김

        if (numbersOnly.length < 4) return numbersOnly
        if (numbersOnly.length < 7) {
            return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`
        }
        if (numbersOnly.length <= 11) {
            return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7)}`
        }
        return numbersOnly // 11자리 넘으면 하이픈 없이 그대로
    }



    return (
        <div className="signup-page">
            <div className="signup-wrapper">
                <div className="signup-text">회원가입</div>
                <form onSubmit={handleSignUp}>
                    <input
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                    <br />
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
                    <input
                        type="text"
                        placeholder="전화번호 (예: 010-1234-5678)"
                        value={phone}
                        onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value)
                            setPhone(formatted)
                            validatePhone(formatted)
                        }}
                        required
                    />
                    <br />
                    {phoneError && <p style={{ color: "red" }}>{phoneError}</p>}

                    <button type="submit">회원가입</button>
                </form>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
            </div>
        </div>
    )
}
