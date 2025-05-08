// AdminDashboard.tsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { auth, db } from "../../firebase"
import { doc, getDoc, getDocs, collection } from "firebase/firestore"

export default function AdminDashboard() {
  const { storeId } = useParams() // store1 등
  const [userStoreId, setUserStoreId] = useState("")
  const [favorites, setFavorites] = useState<any[]>([])
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const user = auth.currentUser
      if (!user) return

      const userSnap = await getDoc(doc(db, "users", user.uid))
      if (!userSnap.exists()) return

      const userData = userSnap.data()
      setUserStoreId(userData.storeId || "")

      if (userData.role === "owner" && userData.storeId === storeId) {
        const favSnap = await getDocs(collection(db, "favorites", storeId, "users"))
        setFavorites(favSnap.docs.map((d) => d.data()))
      }

      setAuthChecked(true)
    }

    fetch()
  }, [storeId])

  if (!authChecked) return <p>로딩 중...</p>
  if (userStoreId !== storeId) return <p>해당 가게에 대한 접근 권한이 없습니다.</p>

  return (
    <div>
      <h2>{storeId} 단골 목록</h2>
      <ul>
        {favorites.map((f, i) => (
          <li key={i}>{f.nickname} | {f.phone}</li>
        ))}
      </ul>
    </div>
  )
}
