import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// PC 버전은 그대로 유지하고, 모바일에서 가게 리스트 누락 및 지도 렌더링 문제 해결
// 모바일에서 지도 ID 중복 사용으로 생긴 문제 해결, 지도는 따로 렌더링되도록 분리
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeData } from '../data/storeData';
const filters = [
    { label: 'Pay 시스템', key: 'pay시스템' },
    { label: '남녀 화장실 구분', key: '남녀화장실구분' },
    { label: '단체 예약 가능', key: '단체예약가능' },
    { label: '단체 이용 가능', key: '단체이용가능' },
    { label: '무료 와이파이', key: '무료와이파이' },
    { label: '식육점 & 식당 분리형', key: '식육점&식당분리형' },
    { label: '야외 좌석', key: '야외좌석' },
    { label: '예약 가능', key: '예약가능' },
    { label: '유아 전용 자리', key: '유아전용자리' },
    { label: '일반 식사 가능', key: '일반식사가능' },
    { label: '주문 배송 가능', key: '주문배송가능' },
    { label: '주차장 구비', key: '주차장구비' }
];
export default function StoreFilterPage() {
    const [activeFilters, setActiveFilters] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const overlaysRef = useRef([]);
    const navigate = useNavigate();
    const mapId = isMobile ? 'mobileMap' : 'filterMap';
    useEffect(() => {
        const stores = activeFilters.length === 0
            ? storeData
            : storeData.filter(store => activeFilters.every(filterKey => store.options?.includes(filterKey)));
        setFilteredStores(stores);
    }, [activeFilters]);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d65716a4db9e8a93aaff1dfc09ee36b8`;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById(mapId);
                if (!container)
                    return;
                const map = new window.kakao.maps.Map(container, {
                    center: new window.kakao.maps.LatLng(35.413, 128.123),
                    level: 4
                });
                mapRef.current = map;
                updateMarkers(activeFilters.length === 0 ? storeData : filteredStores);
            });
        };
        document.head.appendChild(script);
    }, [showMap, filteredStores]);
    const updateMarkers = (stores) => {
        const map = mapRef.current;
        if (!map)
            return;
        markersRef.current.forEach(marker => marker.setMap(null));
        overlaysRef.current.forEach(overlay => overlay.setMap(null));
        markersRef.current = [];
        overlaysRef.current = [];
        stores.forEach(store => {
            const position = new window.kakao.maps.LatLng(store.lat, store.lng);
            const marker = new window.kakao.maps.Marker({ position, map });
            markersRef.current.push(marker);
            const contentDiv = document.createElement('div');
            contentDiv.innerText = store.name;
            contentDiv.onclick = () => setSelectedStore(store);
            contentDiv.style.cssText = `padding:6px 12px; background:white; border-radius:8px; font-size:13px; font-weight:bold; color:#333; box-shadow:0 2px 6px rgba(0,0,0,0.2); border:1px solid #ddd; white-space:nowrap; cursor:pointer; text-align:center;`;
            const overlay = new window.kakao.maps.CustomOverlay({
                position,
                content: contentDiv,
                yAnchor: 1.5
            });
            overlay.setMap(map);
            overlaysRef.current.push(overlay);
        });
    };
    const toggleFilter = (key) => {
        setActiveFilters(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]);
    };
    return (_jsx("div", { style: { fontFamily: 'sans-serif' }, children: isMobile ? (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'flex', overflowX: 'auto', padding: '10px', gap: '8px' }, children: [_jsx("button", { onClick: () => setShowMap(!showMap), style: { marginLeft: 'auto', padding: '10px 12px', borderRadius: '8px', background: '#222', color: '#fff' }, children: "\uD83D\uDDFA" }), filters.map(({ label, key }) => (_jsx("button", { onClick: () => toggleFilter(key), style: { padding: '2px 12px', borderRadius: '16px', backgroundColor: activeFilters.includes(key) ? '#C8102E' : '#eee', color: activeFilters.includes(key) ? '#fff' : '#333', border: 'none', whiteSpace: 'nowrap' }, children: label }, key)))] }), showMap && (_jsxs("div", { style: { position: 'relative' }, children: [_jsx("div", { id: "mobileMap", style: { width: '100%', height: '50vh' } }), selectedStore && (_jsxs("div", { style: { position: 'absolute', bottom: 0, left: 0, width: '100%', background: '#fff', padding: '16px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', boxShadow: '0 -2px 8px rgba(0,0,0,0.2)' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("h3", { children: selectedStore.name }), _jsx("button", { onClick: () => setShowMap(false), children: "\u2716" })] }), _jsx("p", { children: selectedStore.address }), _jsx("p", { children: selectedStore.phone }), _jsx("a", { href: `https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`, target: "_blank", rel: "noopener noreferrer", children: "\uD83D\uDCCD \uAE38\uCC3E\uAE30" })] }))] })), _jsxs("div", { style: { padding: '10px' }, children: [filteredStores.map(store => (_jsxs("div", { style: { display: 'flex', gap: '12px', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', padding: '12px', marginBottom: '12px', alignItems: 'center' }, children: [_jsx("img", { src: store.image || '/img/default.jpg', alt: store.name, style: { width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 } }), _jsxs("div", { children: [_jsx("h3", { style: { margin: 0 }, children: store.name }), _jsx("p", { style: { margin: '4px 0' }, children: store.address }), _jsx("p", { style: { margin: '4px 0' }, children: store.phone })] })] }, store.name))), selectedStore && (_jsxs("div", { style: {
                                position: 'absolute',
                                right: '50px',
                                bottom: '120px',
                                width: '260px',
                                background: '#fff',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                                zIndex: 1000
                            }, children: [_jsx("button", { onClick: () => { setShowMap(false); setSelectedStore(null); }, style: { background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }, children: "\u2716" }), _jsx("h3", { style: { margin: 0 }, children: selectedStore.name }), _jsx("p", { style: { fontSize: '13px', margin: '4px 0' }, children: selectedStore.address }), _jsx("p", { style: { fontSize: '13px', margin: '4px 0' }, children: selectedStore.phone }), _jsx("a", { href: `https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`, target: "_blank", rel: "noopener noreferrer", style: {
                                        fontSize: '13px',
                                        color: '#0077cc',
                                        textDecoration: 'underline',
                                        display: 'inline-block',
                                        marginTop: '10px'
                                    }, children: "\uD83D\uDCCD \uAE38\uCC3E\uAE30" })] }))] })] })) : (_jsx("div", { style: { margin: '0 200px' }, children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', height: '100vh', }, children: [_jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px 0', justifyContent: 'center', margin: '10px' }, children: filters.map(({ label, key }) => (_jsx("button", { onClick: () => toggleFilter(key), style: {
                                padding: '8px 16px',
                                backgroundColor: activeFilters.includes(key) ? '#C8102E' : '#eee',
                                color: activeFilters.includes(key) ? '#fff' : '#333',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: 'pointer'
                            }, children: label }, key))) }), _jsxs("div", { style: { display: 'flex', flex: 1, overflow: 'hidden', height: '100%' }, children: [_jsx("div", { style: { flex: 1, maxWidth: '60%', overflowY: 'auto', padding: '20px', boxSizing: 'border-box' }, children: filteredStores.map(store => (_jsxs("div", { style: {
                                        display: 'flex',
                                        background: '#fff',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        padding: '16px',
                                        gap: '16px',
                                        marginBottom: '16px',
                                        alignItems: 'flex-start',
                                        cursor: 'pointer'
                                    }, onClick: () => navigate(`/store/${encodeURIComponent(store.name)}`), children: [_jsx("img", { src: store.image || '/img/default.jpg', alt: store.name, style: {
                                                width: '230px',
                                                height: '180px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                                flexShrink: 0
                                            } }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h3", { style: { fontSize: '18px', marginBottom: '4px' }, children: store.name }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '8px' }, children: [_jsx("span", { style: { color: '#ffc107', fontSize: '16px', marginRight: '6px' }, children: "\u2605 \u2605 \u2605 \u2605 \u2606" }), _jsx("span", { style: { fontSize: '14px', color: '#666' }, children: "(123 \uB9AC\uBDF0)" })] }), _jsxs("p", { style: { fontSize: '14px', margin: '2px 0' }, children: [_jsx("strong", { children: "\uD83D\uDCCD" }), " ", store.address] }), _jsxs("p", { style: { fontSize: '14px', margin: '2px 0' }, children: [_jsx("strong", { children: "\uD83D\uDCDE" }), " ", store.phone] }), store.options?.length > 0 && (_jsx("div", { style: {
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: '6px',
                                                        marginTop: '6px'
                                                    }, children: store.options.map(opt => (_jsxs("span", { style: {
                                                            background: '#f5f5f5',
                                                            borderRadius: '20px',
                                                            padding: '4px 10px',
                                                            fontSize: '12px',
                                                            color: '#555'
                                                        }, children: ["#", opt] }, opt))) }))] })] }, store.name))) }), _jsxs("div", { style: { width: '40%', height: '100%', position: 'sticky', top: 0, flex: 0.9 }, children: [_jsx("div", { id: "filterMap", style: { width: '100%', height: '100%', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' } }), selectedStore && (_jsxs("div", { style: {
                                            position: 'absolute',
                                            right: '50px',
                                            bottom: '120px',
                                            width: '260px',
                                            background: '#fff',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                                            zIndex: 1000
                                        }, children: [_jsx("h3", { style: { margin: 0 }, children: selectedStore.name }), _jsx("p", { style: { fontSize: '13px', margin: '4px 0' }, children: selectedStore.address }), _jsx("p", { style: { fontSize: '13px', margin: '4px 0' }, children: selectedStore.phone }), _jsx("a", { href: `https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`, target: "_blank", rel: "noopener noreferrer", style: {
                                                    fontSize: '13px',
                                                    color: '#0077cc',
                                                    textDecoration: 'underline',
                                                    display: 'inline-block',
                                                    marginTop: '10px'
                                                }, children: "\uD83D\uDCCD \uAE38\uCC3E\uAE30" })] }))] })] })] }) })) }));
}
