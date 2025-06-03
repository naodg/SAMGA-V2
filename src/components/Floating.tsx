import React, { useState } from "react"
import axios from "axios"
import "./Floating.css"

export default function Floating() {
  const [open, setOpen] = useState(false)

  const reservableStores = [
    "대가1호점",
    "대가한우",
    "대산식육식당",
    "상구한우",
    "삼가명품한우",
  ]

  const handleStoreClick = async (store) => {
  try {
    const res = await axios.post(
      "https://api-qb72atpw7q-uc.a.run.app/sendSMS",
      {
        to: "01049199802",
        message: `테스트 문자입니다. 선택한 매장: ${store}`,
      }
    );
    alert("문자 전송 완료!");
    console.log("문자 발송 성공:", res.data);
  } catch (error) {
    console.error("문자 발송 실패:", error.response || error);
    alert("문자 발송에 실패했습니다.");
  }
};

  return (
    <div className="floating-wrapper">
      {open && (
        <div className="dropdown-menu">
          {reservableStores.map((store, i) => (
            <div
              key={i}
              className="dropdown-item"
              onClick={() => handleStoreClick(store)}
            >
              {store}
            </div>
          ))}
        </div>
      )}
      <div className="floating-mascot" onClick={() => setOpen(!open)}>
        예약
      </div>
    </div>
  )
}