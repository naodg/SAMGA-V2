import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
import "./Floating.css";
export default function Floating() {
    const [open, setOpen] = useState(false);
    const reservableStores = [
        "대가1호점",
        "대가한우",
        "대산식육식당",
        "상구한우",
        "삼가명품한우",
    ];
    const handleStoreClick = async (store) => {
        try {
            const res = await axios.post("https://api-qb72atpw7q-uc.a.run.app/sendSMS", {
                to: "01049199802",
                message: `테스트 문자입니다. 선택한 매장: ${store}`,
            });
            alert("문자 전송 완료!");
            console.log("문자 발송 성공:", res.data);
        }
        catch (error) {
            console.error("문자 발송 실패:", error.response || error);
            alert("문자 발송에 실패했습니다.");
        }
    };
    return (_jsxs("div", { className: "floating-wrapper", children: [open && (_jsx("div", { className: "dropdown-menu", children: reservableStores.map((store, i) => (_jsx("div", { className: "dropdown-item", onClick: () => handleStoreClick(store), children: store }, i))) })), _jsx("div", { className: "floating-mascot", onClick: () => setOpen(!open), children: "\uC608\uC57D" })] }));
}
