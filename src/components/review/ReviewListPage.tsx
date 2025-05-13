import { useEffect, useState } from "react"
import { db, auth } from "../../firebase"
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  updateDoc, arrayUnion, arrayRemove,
} from "firebase/firestore"
import { storeData } from "../../data/storeData"
import { useNavigate } from "react-router-dom"
import './ReviewListPage.css'

interface Review {
  id: string
  content: string
  storeId: string
  nickname: string
  createdAt: any
  star?: number
  likes?: string[] // 👈 이거 추가!
}

interface Comment {
  id: string
  content: string
  createdAt: any
  nickname: string
}

const getStoreById = (storeId: string) => {
  const index = parseInt(storeId.replace("store", ""))
  return storeData[index - 1]
}

export default function ReviewListPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [selectedStoreId, setSelectedStoreId] = useState("all")
  const [isEnd, setIsEnd] = useState(false)
  const navigate = useNavigate()

  const [currentUserRole, setCurrentUserRole] = useState<string>("")
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({})
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({})

  const [userStoreId, setUserStoreId] = useState("")

  // 댓글들을 저장하는 상태
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({})


  const uid = auth.currentUser?.uid;
  const [likeMap, setLikeMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});




  const fetchReviews = async (initial = false) => {
    let q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc"),
      limit(20)
    )


    let storeId = selectedStoreId;

    if (selectedStoreId !== "all") {
      const matchedIndex = storeData.findIndex(s => s.name === selectedStoreId);
      if (matchedIndex !== -1) {
        storeId = `store${matchedIndex + 1}`;
      } else {
        console.error("해당 가게 이름이 storeData에 없습니다.");
        return;
      }

      q = query(
        collection(db, "reviews"),
        where("storeId", "==", storeId),
        orderBy("createdAt", "desc"),
        limit(20)
      );
    }


    if (!initial && lastDoc) {
      q = query(q, startAfter(lastDoc))
    }

    const snapshot = await getDocs(q)
    const newReviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[]

    if (initial) {
      setReviews(newReviews)
    } else {
      setReviews(prev => [...prev, ...newReviews])
    }

    // 댓글도 같이 불러오기
    newReviews.forEach(review => {
      fetchCommentsForReview(review.id)
    })

    if (snapshot.docs.length < 20) {
      setIsEnd(true)
    }

    const lastVisible = snapshot.docs[snapshot.docs.length - 1]
    setLastDoc(lastVisible)
  }

  useEffect(() => {
    const fetchAll = async () => {
      setReviews([])
      setLastDoc(null)
      setIsEnd(false)
      await fetchReviews(true)
    }

    fetchAll()
  }, [selectedStoreId])

  // 사장님들 답글 
  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser
      if (!user) return

      const docRef = doc(db, "users", user.uid)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        const data = snap.data()
        setCurrentUserRole(data.role)
        setUserStoreId(data.storeId) // 🔥 이거 추가!
      }
    }

    fetchUserInfo()
  }, [])


  const handleSubmitReply = async (reviewId: string) => {
    const user = auth.currentUser
    if (!user) return alert("로그인 필요")

    const docRef = doc(db, "users", user.uid)
    const snap = await getDoc(docRef)
    const nickname = snap.exists() ? snap.data().nickname : "알 수 없음"

    if (!replyContent[reviewId]?.trim()) {
      return alert("내용을 입력해주세요.")
    }

    await addDoc(collection(db, "reviews", reviewId, "comments"), {
      content: replyContent[reviewId],
      createdAt: serverTimestamp(),
      nickname,
      userId: user.uid,
    })

    alert("답글이 등록되었습니다!")
    setReplyContent(prev => ({ ...prev, [reviewId]: "" }))
    setShowReplyForm(prev => ({ ...prev, [reviewId]: false }))
  }


  // 답글 불러오기 
  const fetchCommentsForReview = async (reviewId: string) => {
    const commentSnapshot = await getDocs(
      collection(db, "reviews", reviewId, "comments")
    )
    const comments = commentSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[]

    setCommentsMap(prev => ({ ...prev, [reviewId]: comments }))
  }



  useEffect(() => {
    if (reviews.length && uid) {
      const newLikeMap: Record<string, boolean> = {};
      const newCountMap: Record<string, number> = {};

      reviews.forEach(r => {
        const likes = r.likes || [];
        newLikeMap[r.id] = likes.includes(uid);
        newCountMap[r.id] = likes.length;
      });

      setLikeMap(newLikeMap);
      setLikeCountMap(newCountMap);
    }
  }, [reviews, uid]);


  const toggleLike = async (reviewId: string) => {
    const user = auth.currentUser;
    if (!user) return alert("로그인 필요!");

    const reviewRef = doc(db, "reviews", reviewId);
    const alreadyLiked = likeMap[reviewId];

    if (alreadyLiked) {
      await updateDoc(reviewRef, {
        likes: arrayRemove(user.uid),
      });
      setLikeMap(prev => ({ ...prev, [reviewId]: false }));
      setLikeCountMap(prev => ({ ...prev, [reviewId]: prev[reviewId] - 1 }));
    } else {
      await updateDoc(reviewRef, {
        likes: arrayUnion(user.uid),
      });
      setLikeMap(prev => ({ ...prev, [reviewId]: true }));
      setLikeCountMap(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));
    }
  };



  return (
    <div className="review-list-page">
      <div className="review-list-header">
        <h2 className="review-title">리뷰 목록</h2>
        <select
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(e.target.value)}
          className="store-filter-dropdown"
        >
          <option value="all">전체 보기</option>
          {storeData.map((store, i) => (
            <option key={i} value={store.name}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {reviews.length === 0 && <p className="no-review">작성된 리뷰가 아직 없어요!</p>}

      <div className="review-list-grid">
        {reviews.map((review) => {
          const store = getStoreById(review.storeId)
          return (
            <div
              className="review-card"
              key={review.id}
              onClick={() => navigate(`/review/${review.id}`)}
              style={{ cursor: "pointer" }}
            >

              {store && (
                <>
                  <div className="store-badge-wrapper">
                    <img src="/SAMGA-V2/img/icon/수퍼히어로랜딩.svg" className="store-badge-icon" alt="소탈이" />
                    <div className="store-badge">
                      <span className="store-badge-name">{store.name}</span>
                    </div>
                  </div>


                  <div className="review-main">
                    <div className="review-header">
                      <h3 className="store-name">{store.name}</h3>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => {
                          const value = i + 1;
                          const src =
                            review.star >= value
                              ? "/SAMGA-V2/img/icon/단골등록해제.svg"
                              : review.star + 0.5 >= value
                                ? "/SAMGA-V2/img/icon/반쪽자리별.svg"
                                : "/SAMGA-V2/img/icon/단골등록.svg";
                          return <img key={i} src={src} className="star-icon" alt="별" />;
                        })}
                        <span className="review-star-value">{(review.star ?? 0).toFixed(1)}점</span>
                      </div>
                    </div>

                    <div className="review-content">
                      <p>{review.content}</p>
                    </div>

                    <div className="review-footer">
                      <div className="review-icons">
                        <img
                          src={
                            likeMap[review.id]
                              ? "/SAMGA-V2/img/icon/좋아용누름.svg"
                              : "/SAMGA-V2/img/icon/좋아용.svg"
                          }
                          alt="좋아요"
                          onClick={(e) => {
                            e.stopPropagation(); // 상세페이지 이동 막기
                            toggleLike(review.id);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                        <span>{likeCountMap[review.id] || 0}</span>

                        <img
                          src={
                            commentsMap[review.id]?.length
                              ? "/SAMGA-V2/img/icon/댓글있음.svg"
                              : "/SAMGA-V2/img/icon/댓글.svg"
                          }
                          alt="댓글"
                        />

                      </div>
                      <div className="review-meta">
                        <span className="review-nickname">작성자: {review.nickname}</span>
                        <br />
                        <span className="review-date">
                          {review.createdAt?.toDate().toLocaleString() || "날짜 없음"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>


          )
        })}
      </div>

      {!isEnd && (
        <button className="load-more-button" onClick={() => fetchReviews()}>
          더보기
        </button>
      )}

      <button className="write-review-fixed" onClick={() => navigate("/write")}>
        리뷰 쓰기
      </button>
    </div>
  )
}
