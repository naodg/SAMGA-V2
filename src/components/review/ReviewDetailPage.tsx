import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useEffect, useState } from "react"

export default function ReviewDetailPage() {
  const { id } = useParams()
  const [review, setReview] = useState<any>(null)

  useEffect(() => {
    const fetchReview = async () => {
      const snap = await getDoc(doc(db, "reviews", id))
      if (snap.exists()) {
        setReview(snap.data())
      }
    }

    fetchReview()
  }, [id])

  if (!review) return <div>로딩 중...</div>

  return (
    <div className="review-detail-page">
      <h2>{review.title}</h2>
      <p>{review.content}</p>
      <p>작성자: {review.nickname}</p>
      <p>{review.createdAt?.toDate().toLocaleString()}</p>
    </div>
  )
}
