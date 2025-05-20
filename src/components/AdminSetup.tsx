import { useEffect } from "react"
import { db } from "../firebase"
import { doc, setDoc, collection,serverTimestamp  } from "firebase/firestore"
import { storeData } from "../data/storeData"

export default function AdminSetup() {
    useEffect(() => {
        const setupStores = async () => {
            for (let i = 0; i < storeData.length; i++) {
                const storeId = `store${i + 1}`
                const storeRef = doc(db, "stores", storeId)

                // 1. 가게 문서 생성
                await setDoc(storeRef, {
                    name: storeData[i].name
                })

                // 2. 서브컬렉션 dummy 문서 추가 (필수는 아니지만 Firestore에서 컬렉션 확인 편하게 하려고)
                const tabs = ["menu", "side", "amenities"]
                for (const tab of tabs) {
                    const dummyRef = doc(collection(db, "stores", storeId, tab))
                    await setDoc(dummyRef, {
                        url: "",
                        createdAt: serverTimestamp()
                    })
                }

                console.log(`${storeId} 완료`)
            }
            alert("전체 세팅 완료!")
        }

        setupStores()
    }, [])

    return <div>스토어 초기 세팅 중...</div>
}
