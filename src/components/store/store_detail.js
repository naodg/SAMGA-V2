import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import '/node_modules/swiper/swiper.min.css';
import '/node_modules/swiper/modules/navigation.min.css';
import '/node_modules/swiper/modules/pagination.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { storeData } from '../../data/storeData';
const tabs = ['가게 메뉴', '상차림', '편의시설'];
export default function StoreDetail() {
    const { name } = useParams();
    const storeName = decodeURIComponent(name || '');
    const selectedStore = storeData.find((store) => store.name === storeName);
    const imageCount = 4;
    const images = Array.from({ length: imageCount }, (_, i) => `/samga/store/${storeName}_${i + 1}.jpg`);
    const [storeInfo, setStoreInfo] = useState(null);
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;
    const initialGridColumns = !isMobile ? 6 : isTablet ? 4 : 2;
    // 사진들 코드
    const [activeTab, setActiveTab] = useState('가게 메뉴');
    const tabToFolderMap = {
        '가게 메뉴': 'menu',
        '상차림': 'side',
        '편의시설': 'amenities',
    };
    // ✅ 시도할 최대 이미지 개수 (10장까지)
    const MAX_IMAGES = 10;
    const folder = tabToFolderMap[activeTab];
    const imageCandidates = Array.from({ length: MAX_IMAGES }, (_, i) => `${storeName}_${i + 1}`);
    const amenityIcons = [
        'pay시스템.jpg',
        '남녀화장실구분.jpg',
        '단체예약가능.jpg',
        '단체이용가능.jpg',
        '무료와이파이.jpg',
        '식육점&식당분리형.jpg',
        '야외좌석.jpg',
        '예약가능.jpg',
        '유아전용자리.jpg',
        '일반식사가능.jpg',
        '주문배송가능.jpg',
        '주차장구비.jpg'
    ];
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-place/v1/search', {
                    params: { query: storeName },
                    headers: {
                        'X-NCP-APIGW-API-KEY-ID': 'b9391ksmhk',
                        'X-NCP-APIGW-API-KEY': 'QowSM3dPxevzKk0vfm5hoqXqnOoXIOFmYJKontRM'
                    }
                });
                const firstResult = response.data.places?.[0];
                setStoreInfo(firstResult);
            }
            catch (error) {
                console.error('가게 정보를 가져오는 중 오류 발생:', error);
            }
        };
        if (storeName)
            fetchStoreData();
    }, [storeName]);
    return (_jsxs("div", { style: { maxWidth: '1920px', margin: '0 auto', padding: '60px 20px', fontFamily: 'sans-serif' }, children: [_jsx(Swiper, { modules: [Navigation, Pagination, Autoplay], slidesPerView: 1.2, centeredSlides: true, spaceBetween: 30, pagination: { clickable: true }, autoplay: { delay: 2000 }, loop: true, style: { width: '100%', height: '600px', borderRadius: '12px', marginBottom: '40px' }, children: images.map((src, idx) => (_jsx(SwiperSlide, { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' }, children: _jsx("img", { src: src, alt: `${storeName} 대표 이미지 ${idx + 1}`, style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' } }) }, idx))) }), _jsxs("div", { style: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '100px',
                    marginBottom: '60px',
                    width: '100%',
                    maxWidth: '1080px',
                    margin: '0 auto',
                    // marginLeft: isMobile ? '0' : '155px',
                }, children: [_jsxs("div", { style: { minWidth: '300px', flex: '0 0 auto' }, children: [_jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }, children: selectedStore?.hashtag.map((tag, i) => (_jsx("span", { style: {
                                        background: '#f5f5f5',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        color: '#333'
                                    }, children: tag }, i))) }), _jsxs("div", { style: {
                                    // border: '1px solid #e0e0e0',
                                    // borderRadius: '12px',
                                    padding: '10px',
                                    maxWidth: '360px',
                                    backgroundColor: '#fff',
                                    // boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    lineHeight: 1.4
                                }, children: [_jsx("div", { style: { marginBottom: '4px' }, children: _jsx("img", { src: selectedStore?.logo, alt: "\uB85C\uACE0", style: { height: '70px', display: 'block', margin: '0 auto' } }) }), _jsx("h2", { style: {
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#222',
                                            margin: '0 0 10px 0',
                                            // textAlign: 'center'
                                        }, children: selectedStore?.name }), _jsxs("p", { style: { margin: '2px 0', fontSize: '14px' }, children: [_jsx("strong", { children: "\uD83D\uDCCD \uC8FC\uC18C:" }), " ", selectedStore?.address] }), _jsxs("p", { style: { margin: '2px 0', fontSize: '14px' }, children: [_jsx("strong", { children: "\uD83D\uDCDE \uC804\uD654\uBC88\uD638:" }), " ", selectedStore?.phone] }), _jsxs("p", { style: { margin: '2px 0', fontSize: '14px' }, children: [_jsx("strong", { children: "\u23F0 \uC601\uC5C5\uC2DC\uAC04:" }), " ", selectedStore?.hours] }), selectedStore?.point && (_jsxs("p", { style: { margin: '6px 0 0', color: '#C8102E', fontStyle: 'italic', fontSize: '13px' }, children: ["\u26A0\uFE0F ", selectedStore.point] }))] })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: isMobile ? 'center' : 'center',
                                    gap: '16px',
                                    marginBottom: '10px',
                                }, children: ['📝리뷰 작성', '💖즐겨찾기', '📌단골 등록'].map((label, i) => (_jsx("button", { style: {
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#f8f8f8',
                                        fontSize: '14px',
                                        color: '#333',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }, onClick: () => alert(`${label} 눌렀다!`), children: label }, i))) }), _jsx("div", { style: {
                                    // border: '1px solid #e0e0e0',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    backgroundColor: '#fff',
                                    // boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    display: 'grid',
                                    gridTemplateColumns: isMobile
                                        ? 'repeat(auto-fit, minmax(80px, 1fr))'
                                        : 'repeat(6, 1fr)', // ✅ PC에서는 무조건 2줄
                                    gridTemplateRows: isMobile ? 'auto' : 'repeat(2, auto)',
                                    rowGap: '12px',
                                    columnGap: '12px',
                                    justifyItems: 'center',
                                    textAlign: 'center',
                                    boxSizing: 'border-box',
                                    maxWidth: '700px'
                                }, children: amenityIcons.map((file, i) => {
                                    const key = file.replace('.jpg', '');
                                    const isActive = selectedStore?.options.includes(key);
                                    return (_jsxs("div", { style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            wordBreak: 'keep-all',
                                            whiteSpace: 'normal',
                                            maxWidth: '80px',
                                            opacity: isActive ? 1 : 0.3,
                                            transition: 'opacity 0.3s ease',
                                        }, children: [_jsx("img", { src: `/img/amenities/${file}`, alt: key, style: {
                                                    width: '36px',
                                                    height: '36px',
                                                    objectFit: 'contain',
                                                    marginBottom: '4px'
                                                } }), _jsx("p", { style: {
                                                    fontSize: '13px',
                                                    color: '#444',
                                                    lineHeight: '1.3',
                                                    textAlign: 'center',
                                                    margin: 0
                                                }, children: key })] }, i));
                                }) })] })] }), _jsx("hr", { style: { border: 'none', borderTop: '1px solid #ccc', margin: '60px 0 0' } }), _jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '80px', // 이미지와 스토리 사이 여백
                    margin: '150px auto 500px',
                    maxWidth: '1400px',
                    position: 'relative'
                }, children: [_jsxs("div", { style: { position: 'relative', width: '500px', height: '420px', flex: 1, }, children: [_jsx("div", { style: {
                                    position: 'absolute',
                                    bottom: '-300px', // 👈 여기서 살짝 내려줌
                                    left: '-100px',
                                    width: '600px',
                                    height: '400px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    zIndex: 1,
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                                }, children: _jsx("img", { src: selectedStore?.meatimage, alt: "\uACE0\uAE30", style: { width: '100%', height: '100%', objectFit: 'cover' } }) }), _jsx("div", { style: {
                                    position: 'absolute',
                                    top: '30px',
                                    left: '150px',
                                    width: '500px',
                                    height: '500px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    zIndex: 2,
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                                }, children: _jsx("img", { src: images[0], alt: "\uB300\uD45C \uC774\uBBF8\uC9C0", style: { width: '100%', height: '100%', objectFit: 'cover' } }) })] }), _jsxs("div", { style: {
                            flex: 1,
                            minWidth: '0', // flex item이 너무 넓어지지 않게
                            maxWidth: '600px',
                            textAlign: 'left',
                            fontSize: '16px',
                            lineHeight: '1.8',
                            color: '#333'
                        }, children: [_jsxs("h3", { style: { fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }, children: [selectedStore?.name, "\uC758 \uC2A4\uD1A0\uB9AC"] }), _jsx("p", { style: { whiteSpace: 'pre-line' }, children: selectedStore?.story })] })] }), _jsxs("div", { style: { margin: ' 0 150px 00px' }, children: [_jsx("h3", { style: { marginBottom: '20px' }, children: "\uD83D\uDCF8 \uAC00\uAC8C \uC0C1\uC138 \uC774\uBBF8\uC9C0" }), _jsx("div", { style: { display: 'flex', gap: '12px', marginBottom: '30px' }, children: tabs.map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), style: {
                                padding: '8px 16px',
                                borderRadius: '20px',
                                backgroundColor: activeTab === tab ? '#C8102E' : '#f5f5f5',
                                color: activeTab === tab ? '#fff' : '#333',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 500
                            }, children: tab }, tab))) }), _jsx("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(4, 1fr)',
                            gap: '10px'
                        }, children: imageCandidates.map((name) => (['.jpg', '.JPG'].map((ext) => {
                            const src = `/samga/store/${folder}/${name}${ext}`;
                            return (_jsx("img", { src: src, alt: `${storeName} ${activeTab}`, style: {
                                    width: '400px',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    display: 'block'
                                }, onError: (e) => {
                                    e.target.style.display = 'none';
                                } }, src));
                        }))) })] }), _jsxs("div", { style: { margin: ' 150px 150px 00px' }, children: [_jsx("h3", { children: "\uD83D\uDCDD \uB9AC\uBDF0" }), _jsx("div", { style: {
                            background: '#f2f2f2',
                            padding: '30px',
                            borderRadius: '12px',
                            textAlign: 'center',
                            color: '#999'
                        }, children: _jsx("p", { children: "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uB9AC\uBDF0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uCCAB \uB9AC\uBDF0\uB97C \uB0A8\uACA8\uBCF4\uC138\uC694!" }) })] })] }));
}
