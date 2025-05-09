import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// AdminDashboard.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import './AdminDashboard.css';
import { storeData } from "../../data/storeData";
export default function AdminDashboard() {
    const { storeId } = useParams(); // store1 등
    const [userStoreId, setUserStoreId] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [authChecked, setAuthChecked] = useState(false);
    const storeIndex = parseInt((storeId || "").replace("store", "")) - 1;
    const storeName = storeData[storeIndex]?.name || storeId;
    useEffect(() => {
        const fetch = async () => {
            const user = auth.currentUser;
            if (!user)
                return;
            const userSnap = await getDoc(doc(db, "users", user.uid));
            if (!userSnap.exists())
                return;
            const userData = userSnap.data();
            setUserStoreId(userData.storeId || "");
            if (userData.role === "owner" && userData.storeId === storeId) {
                const favSnap = await getDocs(collection(db, "favorites", storeId, "users"));
                setFavorites(favSnap.docs.map((d) => d.data()));
            }
            setAuthChecked(true);
        };
        fetch();
    }, [storeId]);
    if (!authChecked)
        return _jsx("p", { children: "\uB85C\uB529 \uC911..." });
    if (userStoreId !== storeId)
        return _jsx("p", { children: "\uD574\uB2F9 \uAC00\uAC8C\uC5D0 \uB300\uD55C \uC811\uADFC \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." });
    return (_jsxs("div", { className: "regular-wrapper", children: [_jsxs("h2", { children: [storeName, "\uC758 \uB2E8\uACE8 \uBAA9\uB85D"] }), _jsx("ul", { children: favorites.map((f, i) => (_jsxs("li", { children: [f.nickname, " | ", f.phone] }, i))) })] }));
}
