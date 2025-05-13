import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
export default function ReviewDetailPage() {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    useEffect(() => {
        const fetchReview = async () => {
            const snap = await getDoc(doc(db, "reviews", id));
            if (snap.exists()) {
                setReview(snap.data());
            }
        };
        fetchReview();
    }, [id]);
    if (!review)
        return _jsx("div", { children: "\uB85C\uB529 \uC911..." });
    return (_jsxs("div", { className: "review-detail-page", children: [_jsx("h2", { children: review.title }), _jsx("p", { children: review.content }), _jsxs("p", { children: ["\uC791\uC131\uC790: ", review.nickname] }), _jsx("p", { children: review.createdAt?.toDate().toLocaleString() })] }));
}
