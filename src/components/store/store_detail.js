import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { storeData } from '../../data/storeData';
import './StoreDetail.css';
import { storeDetailAssets } from '../../data/storeDetailAssets';
const tabs = ['가게메뉴', '상차림', '편의시설'];
export default function StoreDetail() {
    const { name } = useParams();
    const storeName = decodeURIComponent(name || '');
    const selectedStore = storeData.find((s) => s.name === storeName);
    const [activeTab, setActiveTab] = useState('가게메뉴');
    const [showAllFacilities, setShowAllFacilities] = useState(false);
    const titles = storeDetailAssets[selectedStore.name] || [];
    const facilityIcons = {
        '주문배송': '/img/amenities/주문배송.svg',
        '무료wifi': '/img/amenities/무료wifi.svg',
        '남여화장실구분': '/img/amenities/남여화장실구분.svg',
        '단체이용예약가능': '/img/amenities/단체이용예약가능.svg',
        '주차장': '/img/amenities/주차장.svg',
        '제로페이': '/img/amenities/제로페이.svg',
        '유아의자': '/img/amenities/유아의자.svg',
    };
    const tabToFolderMap = {
        '가게메뉴': 'menu',
        '상차림': 'side',
        '편의시설': 'amenities',
    };
    const currentFolder = tabToFolderMap[activeTab];
    const MAX_IMAGES = 10;
    const imageCandidates = Array.from({ length: MAX_IMAGES }, (_, i) => `${storeName}_${i + 1}`);
    if (!selectedStore)
        return _jsx("div", { children: "\uAC00\uAC8C \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." });
    return (_jsxs("div", { className: "store-detail-wrapper", children: [_jsx("div", { className: "store-hero-image", style: { backgroundImage: `url(${selectedStore.detailimage})` } }), _jsxs("div", { className: "store-info-card", children: [_jsx("img", { src: selectedStore.logo, alt: "\uB85C\uACE0", className: "store-main-logo" }), _jsxs("div", { className: "store-name-stars", children: [_jsx("h2", { className: "store-name", children: selectedStore.name }), _jsx("div", { className: "star-icons", children: "\u2605\u2605\u2605\u2605\u2605" })] }), _jsxs("div", { className: "store-detail", children: [_jsx("span", { className: "label", children: "\uC601\uC5C5\uC2DC\uAC04 :" }), " ", selectedStore.hours.split('/')[0], selectedStore.point && (_jsxs("span", { className: "point", children: [" \u203B ", selectedStore.point] }))] }), _jsxs("div", { className: "store-detail", children: [_jsx("span", { className: "label", children: "\uD734\uBB34 :" }), " ", selectedStore.hours.split('/')[1].replace('휴무', '')] }), _jsxs("div", { className: "store-actions", children: [_jsxs("div", { className: "action-item", children: [_jsx("img", { src: "/img/icon/\uAE38\uCC3E\uAE30.svg", alt: "\uAE38\uCC3E\uAE30" }), _jsx("span", { children: "\uAE38\uCC3E\uAE30" })] }), _jsxs("div", { className: "action-item", children: [_jsx("img", { src: "/img/icon/\uACF5\uC720\uD558\uAE30.svg", alt: "\uACF5\uC720\uD558\uAE30" }), _jsx("span", { children: "\uACF5\uC720\uD558\uAE30" })] }), _jsxs("div", { className: "action-item", children: [_jsx("img", { src: "/img/icon/\uB2E8\uACE8\uB4F1\uB85D.svg", alt: "\uB2E8\uACE8\uB4F1\uB85D" }), _jsx("span", { children: "\uB2E8\uACE8\uB4F1\uB85D" })] }), _jsxs("div", { className: "action-item", children: [_jsx("img", { src: "/img/icon/\uB9AC\uBDF0\uC4F0\uAE30.svg", alt: "\uB9AC\uBDF0\uC4F0\uAE30" }), _jsx("span", { children: "\uB9AC\uBDF0\uC4F0\uAE30" })] })] }), _jsxs("div", { className: "facility-section", children: [_jsx("div", { className: "facility-title", children: "\uD3B8\uC758\uC2DC\uC124" }), _jsx("div", { className: "facility-icons", children: (showAllFacilities ? selectedStore.options : selectedStore.options.slice(0, 4)).map(option => (facilityIcons[option] && (_jsxs("div", { className: "facility-icon", children: [_jsx("img", { src: facilityIcons[option], alt: option }), _jsx("p", { children: option })] }, option)))) }), _jsx("div", { className: "button-location", children: selectedStore.options.length > 4 && (_jsx("button", { className: "more-button", onClick: () => setShowAllFacilities(prev => !prev), children: showAllFacilities
                                        ? '간략히 보기 ▲'
                                        : `+${selectedStore.options.length - 4}개 더보기 ▼` })) })] })] }), _jsx("div", { className: "store-story-wrapper", children: _jsx("div", { className: "store-slogan", children: selectedStore.description.split('\n').map((line, i) => (_jsx("div", { children: line }, i))) }) }), _jsx("div", { className: "brand-inner", children: _jsxs("div", { className: "store-brand-wrapper", children: [_jsx("img", { src: "/img/logo/videologo.svg", alt: "videologo", className: "video-logo" }), _jsx("div", { className: "brand-text", children: "KOREAN BEEF VILLAGE SAMGA" }), _jsx("hr", { className: "brand-divider" }), _jsx("img", { src: selectedStore.logo, alt: "logo", className: "store-sub-logo" })] }) }), _jsxs("div", { className: "store-detail-images-separated", children: [_jsx("div", { className: "detail-images-pc only-pc", children: selectedStore.detailImagelist
                            .filter((src) => src.includes('PC'))
                            .map((src, idx) => (_jsxs("div", { className: "pc-image-wrapper", children: [_jsx("img", { src: src, alt: `PC 상세 이미지 ${idx + 1}`, className: "store-image" }), titles[idx] && (_jsx("div", { className: `pc-image-text-overlay ${titles[idx].className}`, children: titles[idx].text.split('\n').map((line, i) => (_jsx("div", { children: line }, i))) }))] }, `pc-${idx}`))) }), _jsx("div", { className: "detail-images-mobile only-mobile", children: selectedStore.detailImagelist
                            .filter((src) => src.includes('M'))
                            .map((src, idx) => (_jsx("img", { src: src, alt: `모바일 상세 이미지 ${idx + 1}`, className: "store-image" }, `m-${idx}`))) })] }), _jsxs("div", { className: "store-detail-top-wrapper", children: [_jsx("h2", { className: "section-title", children: "\uAC00\uAC8C \uC0C1\uC138 \uC774\uBBF8\uC9C0" }), _jsx("div", { className: "tab-buttons", children: tabs.map(tab => (_jsx("button", { className: `tab-button ${activeTab === tab ? 'active' : ''}`, onClick: () => setActiveTab(tab), children: tab }, tab))) }), _jsx("div", { className: "store-images", children: imageCandidates.map((name, idx) => (['.jpg', '.JPG', '.png'].map((ext) => {
                            const src = `/samga/store/${currentFolder}/${name}${ext}`;
                            return (_jsx("img", { src: src, alt: `${storeName} ${activeTab} 이미지 ${idx + 1}`, className: "store-image", onError: (e) => {
                                    e.target.style.display = 'none';
                                } }, src));
                        }))) })] }), _jsxs("div", { className: "store-review-wrapper", children: [_jsxs("div", { className: 'review-item', children: [_jsx("img", { src: '/img/icon/\uB9AC\uBDF0\uC4F0\uAE30.svg', alt: "\uB9AC\uBDF0\uC81C\uBAA9" }), _jsx("span", { children: "\uB9AC\uBDF0\uC4F0\uAE30" })] }), _jsxs("div", { className: "review-placeholder", children: [_jsx("p", { children: "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uB9AC\uBDF0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uCCAB \uB9AC\uBDF0\uB97C \uB0A8\uACA8\uBCF4\uC138\uC694!" }), _jsx("a", { href: `https://search.naver.com/search.naver?query=${encodeURIComponent(storeName)} 리뷰`, target: "_blank", rel: "noopener noreferrer", className: "naver-review-link", children: "\uB124\uC774\uBC84 \uB9AC\uBDF0 \uBCF4\uB7EC\uAC00\uAE30 \u2192" })] })] })] }));
}
