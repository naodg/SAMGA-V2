// AdminDashboard.tsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { auth, db } from "../../firebase"
import { doc, getDoc, getDocs, collection } from "firebase/firestore"
import './AdminDashboard.css'
import { storeData } from "../../data/storeData"

export default function AdminDashboard() {
  const { storeId } = useParams() // store1 등
  const [userStoreId, setUserStoreId] = useState("")
  const [favorites, setFavorites] = useState<any[]>([])
  const [authChecked, setAuthChecked] = useState(false)

  const storeIndex = parseInt((storeId || "").replace("store", "")) - 1
  const storeName = storeData[storeIndex]?.name || storeId

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
    console.log(favorites)

    fetch()
  }, [storeId])

  if (!authChecked) return <p>로딩 중...</p>
  if (userStoreId !== storeId) return <p>해당 가게에 대한 접근 권한이 없습니다.</p>

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <div className="admin-title">
          <img src="/img/icon/character.svg" alt="캐릭터" className="admin-icon" />
          <span>{storeName} 단골 리스트</span>
        </div>

        <img src="/img/icon/download.svg" alt="다운로드" className="download-icon" />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>
              <img src="/SAMGA-V2//img/icon/다운로드.svg" alt="다운로드" className="download-icon" />
            </th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((f, i) => (
            <tr key={i}>
              <td>{f.nickname}</td>
              <td>{f.phone}</td>
              <td>{f.email}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}
