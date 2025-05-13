import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp, } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./ReviewDetailPage.css";
export default function ReviewDetailPage() {
    const { id } = useParams(); // 리뷰 ID
    const [review, setReview] = useState(null);
    const [comment, setComment] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [replyText, setReplyText] = useState("");
    // 🔥 리뷰 데이터 불러오기
    useEffect(() => {
        const fetchData = async () => {
            if (!id)
                return;
            const reviewSnap = await getDoc(doc(db, "reviews", id));
            if (reviewSnap.exists()) {
                setReview({ id: reviewSnap.id, ...reviewSnap.data() });
            }
            const commentSnap = await getDocs(collection(db, "reviews", id, "comments"));
            if (!commentSnap.empty) {
                setComment({ id: commentSnap.docs[0].id, ...commentSnap.docs[0].data() });
            }
            const user = auth.currentUser;
            if (user) {
                const userSnap = await getDoc(doc(db, "users", user.uid));
                if (userSnap.exists()) {
                    setUserInfo(userSnap.data());
                }
            }
        };
        fetchData();
    }, [id]);
    // 🔥 답글 등록
    const handleReply = async () => {
        if (!replyText.trim())
            return alert("댓글을 입력해주세요.");
        await addDoc(collection(db, "reviews", id, "comments"), {
            content: replyText,
            createdAt: serverTimestamp(),
            nickname: userInfo?.nickname || "사장님",
            userId: auth.currentUser?.uid,
        });
        setReplyText("");
        alert("댓글 등록 완료!");
        window.location.reload(); // 새로고침으로 갱신
    };
    if (!review)
        return _jsx("div", { children: "\uB85C\uB529 \uC911..." });
    return (_jsxs("div", { className: "review-detail-page", children: [_jsxs("div", { className: "review-box", children: [_jsxs("div", { className: "review-header", children: [_jsx("h2", { children: review.storeName }), _jsxs("div", { className: "review-stars", children: [[...Array(5)].map((_, i) => (_jsx("img", { src: review.star >= i + 1
                                            ? "/SAMGA-V2/img/icon/단골등록해제.svg"
                                            : "/SAMGA-V2/img/icon/단골등록.svg", alt: "\uBCC4", className: "star-icon" }, i))), _jsxs("span", { className: "review-star-value", children: [review.star.toFixed(1), "\uC810"] })] })] }), _jsx("p", { className: "review-content", children: review.content }), _jsxs("div", { className: "review-footer", children: [_jsxs("div", { className: "review-icons", children: [_jsx("img", { src: "/SAMGA-V2/img/icon/\uC88B\uC544\uC6A9.svg", alt: "\uC88B\uC544\uC694" }), _jsx("img", { src: "/SAMGA-V2/img/icon/\uB313\uAE00.svg", alt: "\uB313\uAE00" })] }), _jsxs("div", { className: "review-meta", children: ["\uC791\uC131\uC790: ", review.nickname, _jsx("br", {}), review.createdAt?.toDate().toLocaleString()] })] })] }), comment ? (_jsxs("div", { className: "comment-box", children: [_jsx("div", { className: "comment-header", children: comment.nickname }), _jsx("div", { className: "comment-body", children: comment.content })] })) : userInfo?.role === "owner" ? (_jsxs("div", { className: "comment-form", children: [_jsx("textarea", { value: replyText, onChange: (e) => setReplyText(e.target.value), placeholder: "\uB2F5\uAE00\uC744 \uC791\uC131\uD574\uC8FC\uC138\uC694." }), _jsx("button", { onClick: handleReply, children: "\uB4F1\uB85D" })] })) : null] }));
}
