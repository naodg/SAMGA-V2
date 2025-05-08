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
} from "firebase/firestore"
import { storeData } from "../../data/storeData"
import { useNavigate } from "react-router-dom"
import './ReviewListPage.css'

interface Review {
  id: string
  title: string
  content: string
  storeId: string
  nickname: string
  createdAt: any
  star?: number
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
            <div className="review-card" key={review.id}>
              {store && (
                <div className="store-info">
                  <img src={store.logo} alt={`${store.name} 로고`} className="store-logo" />
                  <p className="store-name">{store.name}</p>

                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => {
                      const value = i + 1
                      let imgSrc = ""

                      if (review.star >= value) {
                        imgSrc = "/img/icon/단골등록해제.svg" // 가득 찬 별
                      } else if (review.star + 0.5 >= value) {
                        imgSrc = "/img/icon/반쪽자리별.svg" // 반쪽 별
                      } else {
                        imgSrc = "/img/icon/단골등록.svg" // 빈 별
                      }

                      return (
                        <img
                          key={i}
                          src={imgSrc}
                          alt="별점"
                          className="star-icon"
                        />
                      )
                    })}
                    <span className="review-star-value">
                      {(review.star ?? 0).toFixed(1)}점
                    </span>
                  </div>

                </div>
              )}

              <div className="review-content">
                <h3>{review.title}</h3>
                <p>{review.content}</p>
              </div>

              <div className="review-meta">
                <span className="review-nickname">작성자: {review.nickname}</span>
                <span className="review-date">
                  {review.createdAt?.toDate().toLocaleString() || "작성일 없음"}
                </span>
              </div>

              {commentsMap[review.id]?.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-nickname">{comment.nickname}</div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-date">
                    {comment.createdAt?.toDate().toLocaleString()}
                  </div>
                </div>
              ))}


              {currentUserRole === "owner" && userStoreId === review.storeId && (
                <div className="reply-toggle">
                  {!showReplyForm[review.id] ? (
                    <button onClick={() => setShowReplyForm(prev => ({ ...prev, [review.id]: true }))}>
                      답글 달기
                    </button>
                  ) : (
                    <div className="reply-form">
                      <textarea
                        className="reply-textarea"
                        placeholder="답글을 입력하세요"
                        value={replyContent[review.id] || ""}
                        onChange={(e) =>
                          setReplyContent(prev => ({ ...prev, [review.id]: e.target.value }))
                        }
                      />
                      <div className="reply-submit">
                        <button onClick={() => handleSubmitReply(review.id)}>등록</button>
                      </div>
                    </div>
                  )}
                </div>
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
