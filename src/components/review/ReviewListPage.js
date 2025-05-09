import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, query, orderBy, where, limit, startAfter, doc, getDoc, addDoc, serverTimestamp, } from "firebase/firestore";
import { storeData } from "../../data/storeData";
import { useNavigate } from "react-router-dom";
import './ReviewListPage.css';
const getStoreById = (storeId) => {
    const index = parseInt(storeId.replace("store", ""));
    return storeData[index - 1];
};
export default function ReviewListPage() {
    const [reviews, setReviews] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [selectedStoreId, setSelectedStoreId] = useState("all");
    const [isEnd, setIsEnd] = useState(false);
    const navigate = useNavigate();
    const [currentUserRole, setCurrentUserRole] = useState("");
    const [replyContent, setReplyContent] = useState({});
    const [showReplyForm, setShowReplyForm] = useState({});
    const [userStoreId, setUserStoreId] = useState("");
    // 댓글들을 저장하는 상태
    const [commentsMap, setCommentsMap] = useState({});
    const fetchReviews = async (initial = false) => {
        let q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(20));
        let storeId = selectedStoreId;
        if (selectedStoreId !== "all") {
            const matchedIndex = storeData.findIndex(s => s.name === selectedStoreId);
            if (matchedIndex !== -1) {
                storeId = `store${matchedIndex + 1}`;
            }
            else {
                console.error("해당 가게 이름이 storeData에 없습니다.");
                return;
            }
            q = query(collection(db, "reviews"), where("storeId", "==", storeId), orderBy("createdAt", "desc"), limit(20));
        }
        if (!initial && lastDoc) {
            q = query(q, startAfter(lastDoc));
        }
        const snapshot = await getDocs(q);
        const newReviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        if (initial) {
            setReviews(newReviews);
        }
        else {
            setReviews(prev => [...prev, ...newReviews]);
        }
        // 댓글도 같이 불러오기
        newReviews.forEach(review => {
            fetchCommentsForReview(review.id);
        });
        if (snapshot.docs.length < 20) {
            setIsEnd(true);
        }
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        setLastDoc(lastVisible);
    };
    useEffect(() => {
        const fetchAll = async () => {
            setReviews([]);
            setLastDoc(null);
            setIsEnd(false);
            await fetchReviews(true);
        };
        fetchAll();
    }, [selectedStoreId]);
    // 사장님들 답글 
    useEffect(() => {
        const fetchUserInfo = async () => {
            const user = auth.currentUser;
            if (!user)
                return;
            const docRef = doc(db, "users", user.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const data = snap.data();
                setCurrentUserRole(data.role);
                setUserStoreId(data.storeId); // 🔥 이거 추가!
            }
        };
        fetchUserInfo();
    }, []);
    const handleSubmitReply = async (reviewId) => {
        const user = auth.currentUser;
        if (!user)
            return alert("로그인 필요");
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        const nickname = snap.exists() ? snap.data().nickname : "알 수 없음";
        if (!replyContent[reviewId]?.trim()) {
            return alert("내용을 입력해주세요.");
        }
        await addDoc(collection(db, "reviews", reviewId, "comments"), {
            content: replyContent[reviewId],
            createdAt: serverTimestamp(),
            nickname,
            userId: user.uid,
        });
        alert("답글이 등록되었습니다!");
        setReplyContent(prev => ({ ...prev, [reviewId]: "" }));
        setShowReplyForm(prev => ({ ...prev, [reviewId]: false }));
    };
    // 답글 불러오기 
    const fetchCommentsForReview = async (reviewId) => {
        const commentSnapshot = await getDocs(collection(db, "reviews", reviewId, "comments"));
        const comments = commentSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        setCommentsMap(prev => ({ ...prev, [reviewId]: comments }));
    };
    return (_jsxs("div", { className: "review-list-page", children: [_jsxs("div", { className: "review-list-header", children: [_jsx("h2", { className: "review-title", children: "\uB9AC\uBDF0 \uBAA9\uB85D" }), _jsxs("select", { value: selectedStoreId, onChange: (e) => setSelectedStoreId(e.target.value), className: "store-filter-dropdown", children: [_jsx("option", { value: "all", children: "\uC804\uCCB4 \uBCF4\uAE30" }), storeData.map((store, i) => (_jsx("option", { value: store.name, children: store.name }, i)))] })] }), reviews.length === 0 && _jsx("p", { className: "no-review", children: "\uC791\uC131\uB41C \uB9AC\uBDF0\uAC00 \uC544\uC9C1 \uC5C6\uC5B4\uC694!" }), _jsx("div", { className: "review-list-grid", children: reviews.map((review) => {
                    const store = getStoreById(review.storeId);
                    return (_jsxs("div", { className: "review-card", children: [store && (_jsxs("div", { className: "store-info", children: [_jsx("img", { src: store.logo, alt: `${store.name} 로고`, className: "store-logo" }), _jsx("p", { className: "store-name", children: store.name }), _jsxs("div", { className: "review-stars", children: [[...Array(5)].map((_, i) => {
                                                const value = i + 1;
                                                let imgSrc = "";
                                                if (review.star >= value) {
                                                    imgSrc = "/SAMGA-V2/img/icon/단골등록해제.svg"; // 가득 찬 별
                                                }
                                                else if (review.star + 0.5 >= value) {
                                                    imgSrc = "/SAMGA-V2/img/icon/반쪽자리별.svg"; // 반쪽 별
                                                }
                                                else {
                                                    imgSrc = "/SAMGA-V2/img/icon/단골등록.svg"; // 빈 별
                                                }
                                                return (_jsx("img", { src: imgSrc, alt: "\uBCC4\uC810", className: "star-icon" }, i));
                                            }), _jsxs("span", { className: "review-star-value", children: [(review.star ?? 0).toFixed(1), "\uC810"] })] })] })), _jsxs("div", { className: "review-content", children: [_jsx("h3", { children: review.title }), _jsx("p", { children: review.content })] }), _jsxs("div", { className: "review-meta", children: [_jsxs("span", { className: "review-nickname", children: ["\uC791\uC131\uC790: ", review.nickname] }), _jsx("span", { className: "review-date", children: review.createdAt?.toDate().toLocaleString() || "작성일 없음" })] }), commentsMap[review.id]?.map((comment) => (_jsxs("div", { className: "comment-item", children: [_jsx("div", { className: "comment-nickname", children: comment.nickname }), _jsx("div", { className: "comment-content", children: comment.content }), _jsx("div", { className: "comment-date", children: comment.createdAt?.toDate().toLocaleString() })] }, comment.id))), currentUserRole === "owner" && userStoreId === review.storeId && (_jsx("div", { className: "reply-toggle", children: !showReplyForm[review.id] ? (_jsx("button", { onClick: () => setShowReplyForm(prev => ({ ...prev, [review.id]: true })), children: "\uB2F5\uAE00 \uB2EC\uAE30" })) : (_jsxs("div", { className: "reply-form", children: [_jsx("textarea", { className: "reply-textarea", placeholder: "\uB2F5\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694", value: replyContent[review.id] || "", onChange: (e) => setReplyContent(prev => ({ ...prev, [review.id]: e.target.value })) }), _jsx("div", { className: "reply-submit", children: _jsx("button", { onClick: () => handleSubmitReply(review.id), children: "\uB4F1\uB85D" }) })] })) }))] }, review.id));
                }) }), !isEnd && (_jsx("button", { className: "load-more-button", onClick: () => fetchReviews(), children: "\uB354\uBCF4\uAE30" })), _jsx("button", { className: "write-review-fixed", onClick: () => navigate("/write"), children: "\uB9AC\uBDF0 \uC4F0\uAE30" })] }));
}
