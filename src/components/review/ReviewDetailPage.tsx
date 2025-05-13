import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { storeData } from "../../data/storeData";
import "./ReviewDetailPage.css";



interface ReviewType {
    id: string;
    storeId: string;
    nickname: string;
    content: string;
    star: number;
    createdAt: any;
}

export default function ReviewDetailPage() {
    const { id } = useParams(); // 리뷰 ID
    const [review, setReview] = useState<any>(null);
    const [comment, setComment] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [replyText, setReplyText] = useState("");
    const [store, setStore] = useState<any>(null);

    // ✅ storeId → storeData 파싱 함수
    const getStoreById = (storeId: string) => {
        const index = parseInt(storeId.replace("store", ""));
        return storeData[index - 1]; // 배열은 0부터 시작
    };

    // ✅ 리뷰, 댓글, 유저정보 불러오기
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            // 리뷰
            const reviewSnap = await getDoc(doc(db, "reviews", id));
            if (reviewSnap.exists()) {
                const reviewData = {
                    id: reviewSnap.id,
                    ...(reviewSnap.data() as { storeId: string;[key: string]: any }),
                };
                const storeObj = getStoreById(reviewData.storeId);
                setStore(storeObj);
                setReview(reviewData);
            }

            // 댓글
            const commentSnap = await getDocs(collection(db, "reviews", id, "comments"));
            if (!commentSnap.empty) {
                const commentData = commentSnap.docs[0];
                setComment({ id: commentData.id, ...commentData.data() });
            }

            // 유저정보
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

    // ✅ 답글 등록
    const handleReply = async () => {
        if (!replyText.trim()) return alert("댓글을 입력해주세요.");

        await addDoc(collection(db, "reviews", id!, "comments"), {
            content: replyText,
            createdAt: serverTimestamp(),
            nickname: userInfo?.nickname || "사장님",
            userId: auth.currentUser?.uid,
        });

        setReplyText("");
        alert("댓글 등록 완료!");
        window.location.reload(); // 새로고침
    };

    if (!review || !store) return <div>로딩 중...</div>;

    return (
        <div className="review-detail-page">
            <div className="review-box">

                {/* ✅ 가게별 로고 표시 */}
                <img src={store.logo} className="review-sticker" alt={store.name} />

                {/* ✅ 수정 / 삭제 버튼 */}
                <div className="review-actions">
                    <img
                        src="/SAMGA-V2/img/icon/수정.svg"
                        alt="수정"
                        className="icon-button"
                        onClick={() => alert("수정")}
                    />
                    <img
                        src="/SAMGA-V2/img/icon/삭제.svg"
                        alt="삭제"
                        className="icon-button"
                        onClick={() => alert("삭제")}
                    />
                </div>


                <div className="review-header">
                    <h2>{store.name}</h2>
                    <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                src={
                                    review.star >= i + 1
                                        ? "/SAMGA-V2/img/icon/단골등록해제.svg"
                                        : "/SAMGA-V2/img/icon/단골등록.svg"
                                }
                                alt="별"
                                className="star-icon"
                            />
                        ))}
                        <span className="review-star-value">{review.star.toFixed(1)}점</span>
                    </div>
                </div>

                <p className="review-content">{review.content}</p>

                <div className="review-footer">
                    <div className="review-icons">
                        <img src="/SAMGA-V2/img/icon/좋아용.svg" alt="좋아요" />
                        <img src="/SAMGA-V2/img/icon/댓글.svg" alt="댓글" />
                    </div>
                    <div className="review-meta">
                        작성자: {review.nickname}
                        <br />
                        {review.createdAt?.toDate().toLocaleString()}
                    </div>
                </div>
            </div>

            {/* 🔥 답글 */}
            {comment ? (
                <div className="comment-box">
                    <div className="comment-header">{comment.nickname}</div>
                    <div className="comment-body">{comment.content}</div>
                </div>
            ) : userInfo?.role === "owner" ? (
                <div className="comment-form">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="답글을 작성해주세요."
                    />
                    <button onClick={handleReply}>등록</button>
                </div>
            ) : null}
        </div>
    );
}
