import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { storeData } from "../../data/storeData";
import "./ReviewDetailPage.css";

export default function ReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<any>(null);
  const [comment, setComment] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [store, setStore] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const getStoreById = (storeId: string) => {
    const index = parseInt(storeId.replace("store", ""));
    return storeData[index - 1];
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const reviewSnap = await getDoc(doc(db, "reviews", id));
      if (reviewSnap.exists()) {
        const reviewData = {
          id: reviewSnap.id,
          ...(reviewSnap.data() as { storeId: string; [key: string]: any })
        };
        const storeObj = getStoreById(reviewData.storeId);
        setStore(storeObj);
        setReview(reviewData);
      }

      const commentSnap = await getDocs(collection(db, "reviews", id, "comments"));
      if (!commentSnap.empty) {
        const commentData = commentSnap.docs[0];
        setComment({ id: commentData.id, ...commentData.data() });
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

  useEffect(() => {
    if (review && auth.currentUser) {
      setLiked(review.likes?.includes(auth.currentUser.uid));
      setLikeCount(review.likes?.length || 0);
    }
  }, [review]);

  const handleReply = async () => {
    if (!replyText.trim()) return alert("댓글을 입력해주세요.");

    await addDoc(collection(db, "reviews", id!, "comments"), {
      content: replyText,
      createdAt: serverTimestamp(),
      nickname: userInfo?.nickname || "사장님",
      userId: auth.currentUser?.uid
    });

    setReplyText("");
    alert("댓글 등록 완료!");
    window.location.reload();
  };

  const toggleLike = async () => {
    const reviewRef = doc(db, "reviews", review.id);
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    if (liked) {
      await updateDoc(reviewRef, {
        likes: arrayRemove(uid)
      });
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      await updateDoc(reviewRef, {
        likes: arrayUnion(uid)
      });
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleUpdate = async () => {
    if (!editedContent.trim()) return alert("내용을 입력해주세요.");
    await updateDoc(doc(db, "reviews", id!), {
      content: editedContent
    });
    setReview((prev: any) => ({ ...prev, content: editedContent }));
    setEditMode(false);
    alert("리뷰가 수정되었습니다.");
  };

  const handleDelete = async () => {
    const ok = window.confirm("정말로 삭제하시겠어요?");
    if (!ok) return;

    await deleteDoc(doc(db, "reviews", id!));
    alert("삭제되었습니다.");
    navigate("/review");
  };

  if (!review || !store) return <div>로딩 중...</div>;

  return (
    <div className="review-detail-page">
      <div className="review-box">
        {auth.currentUser?.uid === review.userId && (
          <div className="review-actions">
            <img
              src="/SAMGA-V2/img/icon/수정.svg"
              alt="수정"
              className="icon-button"
              onClick={() => {
                setEditMode(true);
                setEditedContent(review.content);
              }}
            />
            <img
              src="/SAMGA-V2/img/icon/삭제.svg"
              alt="삭제"
              className="icon-button"
              onClick={handleDelete}
            />
          </div>
        )}

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

        {editMode ? (
          <div className="edit-form">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="edit-textarea"
              placeholder="리뷰 내용을 수정하세요"
            />
            <div className="edit-buttons">
              <button onClick={handleUpdate}>저장</button>
              <button onClick={() => setEditMode(false)}>취소</button>
            </div>
          </div>
        ) : (
          <p className="review-content">{review.content}</p>
        )}

        <div className="review-footer">
          <div className="review-icons">
            <img
              src={
                liked
                  ? "/SAMGA-V2/img/icon/좋아용누름.svg"
                  : "/SAMGA-V2/img/icon/좋아용.svg"
              }
              alt="좋아요"
              className="heart-icon"
              onClick={toggleLike}
            />
            <span>{likeCount}</span>
            <img
              src={
                comment
                  ? "/SAMGA-V2/img/icon/댓글있음.svg"
                  : "/SAMGA-V2/img/icon/댓글.svg"
              }
              alt="댓글"
            />
          </div>
          <div className="review-meta">
            작성자: {review.nickname}<br />
            {review.createdAt?.toDate().toLocaleString()}
          </div>
        </div>

        {comment ? (
          <div className="comment-wrapper">
            <img
              src={store.logo}
              alt={store.name}
              className="comment-sticker"
            />
            <div className="comment-bubble">
              {auth.currentUser?.uid === comment.userId && (
                <div className="comment-actions">
                  <img src="/SAMGA-V2/img/icon/수정.svg" alt="수정" className="icon-button" />
                  <img src="/SAMGA-V2/img/icon/삭제.svg" alt="삭제" className="icon-button" />
                </div>
              )}
              <div className="comment-body">{comment.content}</div>
            </div>
          </div>
        ) : userInfo?.role === "owner" && userInfo?.storeId === review.storeId ? (
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
    </div>
  );
}