import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// PC 버전은 그대로 유지하고, 모바일에서 가게 리스트 누락 및 지도 렌더링 문제 해결
// 모바일에서 지도 ID 중복 사용으로 생긴 문제 해결, 지도는 따로 렌더링되도록 분리
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeData } from '../data/storeData';
const filters = [
    { label: '주차장', key: '주차장' },
    { label: '남여 화장실 구분', key: '남여화장실구분' },
    { label: '예약 가능', key: '예약가능' },
    { label: '단체 이용.예약 가능', key: '단체이용예약가능' },
    { label: '무료 WIFI', key: '무료wifi' },
    { label: '유아의자', key: '유아의자' },
    { label: '일반 식사 메뉴', key: '일반식사메뉴' },
    { label: '주문 배송', key: '주문배송' },
    { label: '포장가능', key: '포장가능' },
    { label: '제로페이', key: '제로페이' },
];
export default function StoreFilterPage() {
    const [activeFilters, setActiveFilters] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const isMobile = window.innerWidth <= 1200;
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const overlaysRef = useRef([]);
    const navigate = useNavigate();
    const [showMore, setShowMore] = useState(false);
    const mapId = isMobile ? 'mobileMap' : 'filterMap';
    const [paddingSize, setPaddingSize] = useState('120px');
    const [openOptions, setOpenOptions] = useState({});
    // ✅ 먼저 상태 추가
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const updatePadding = () => {
            const width = window.innerWidth;
            if (width <= 1600) {
                setPaddingSize('0px'); // 태블릿: 양쪽 40px
            }
            else {
                setPaddingSize('120px'); // 데스크탑: 양쪽 120px
            }
        };
        updatePadding(); // 처음 실행
        window.addEventListener('resize', updatePadding); // 리사이즈 때마다 실행
        return () => window.removeEventListener('resize', updatePadding);
    }, []);
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
            // ✅ 클릭 이벤트를 등록할 때 함수로 selectedStore를 직접 체크하게 만든다
            contentDiv.addEventListener('click', () => {
                setSelectedStore(prevSelected => {
                    if (prevSelected?.name === store.name) {
                        return null; // 같으면 닫기
                    }
                    else {
                        return store; // 다르면 열기
                    }
                });
            });
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
    return (_jsx("div", { children: isMobile ? (_jsxs(_Fragment, { children: [_jsx("div", { style: {
                        width: '100%',
                        padding: '20px 10px 0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }, children: _jsxs("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid #AD5457',
                            background: '#fff',
                            width: '100%',
                            maxWidth: '380px',
                            height: '40px',
                            boxSizing: 'border-box',
                            margin: '90px 0 10px'
                        }, children: [_jsx("button", { onClick: () => {
                                    if (searchQuery.trim() === '') {
                                        setFilteredStores(storeData);
                                        setSelectedStore(null);
                                    }
                                    else {
                                        const results = storeData.filter(store => store.name.includes(searchQuery));
                                        setFilteredStores(results);
                                        setSelectedStore(results[0] ?? null);
                                    }
                                }, style: {
                                    background: '#AD5457',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    height: '40px',
                                    width: '40px'
                                }, children: _jsx("img", { src: "/img/logo/search.svg", alt: "\uAC80\uC0C9 \uC544\uC774\uCF58", style: { width: '20px', height: '20px' } }) }), _jsx("input", { type: "text", value: searchQuery, placeholder: "\uB0B4\uAC00 \uCC3E\uB294 \uC2DD\uB2F9\uC744 \uAC80\uC0C9\uD574\uBCF4\uC138\uC694.", onFocus: () => setShowMap(true), onChange: (e) => {
                                    const keyword = e.target.value;
                                    setSearchQuery(keyword);
                                    if (keyword.trim() === '') {
                                        setFilteredStores(storeData);
                                        setSelectedStore(null);
                                    }
                                    else {
                                        const results = storeData.filter(store => store.name.includes(keyword));
                                        setFilteredStores(results);
                                        setSelectedStore(results[0] ?? null);
                                    }
                                }, onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        const results = storeData.filter(store => store.name.includes(searchQuery));
                                        setFilteredStores(results);
                                        setSelectedStore(results[0] ?? null);
                                    }
                                }, style: {
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '14px',
                                    background: 'transparent',
                                } })] }) }), _jsxs("div", { style: { display: 'flex', overflowX: 'auto', padding: '10px 10px', gap: '8px' }, children: [_jsx("button", { onClick: () => setShowMap(!showMap), style: { marginLeft: 'auto', padding: '5px 12px', borderRadius: '8px', background: '#AD5457', color: '#fff' }, children: _jsx("img", { src: '/img/icon/map.svg', width: '15px' }) }), filters.map(({ label, key }) => (_jsxs("button", { onClick: () => toggleFilter(key), style: { padding: '2px 12px', borderRadius: '16px', backgroundColor: activeFilters.includes(key) ? '#C8102E' : '#eee', color: activeFilters.includes(key) ? '#fff' : '#333', border: 'none', whiteSpace: 'nowrap' }, children: [label, " ", activeFilters.includes(key) && _jsx("span", { style: { marginLeft: '6px' }, children: "\u00D7" })] }, key)))] }), showMap && (_jsxs("div", { style: { position: 'relative' }, children: [_jsx("div", { id: "mobileMap", style: { width: '100%', height: '50vh' } }), selectedStore && (_jsxs("div", { style: { position: 'absolute', bottom: 0, left: 0, width: '100%', background: '#fff', padding: '16px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', boxShadow: '0 -2px 8px rgba(0,0,0,0.2)' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("h3", { children: selectedStore.name }), _jsx("button", { onClick: () => setShowMap(false), children: "\u2716" })] }), _jsx("p", { children: selectedStore.address }), _jsx("p", { children: selectedStore.phone }), _jsx("a", { href: `https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`, target: "_blank", rel: "noopener noreferrer", children: "\uD83D\uDCCD \uAE38\uCC3E\uAE30" })] }))] })), _jsxs("div", { style: { padding: '10px' }, children: [filteredStores.map(store => (_jsxs("div", { onClick: () => navigate(`/store/${encodeURIComponent(store.name)}`), style: {
                                background: '#fff',
                                borderRadius: '12px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                padding: '12px',
                                marginBottom: '12px',
                                cursor: 'pointer',
                            }, children: [_jsxs("div", { style: {
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                    }, children: [_jsx("img", { src: store.image || '/img/default.jpg', alt: store.name, style: {
                                                width: '90px',
                                                height: '90px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                                flexShrink: 0,
                                            } }), _jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: { flex: 1, margin: '0 0 4px 0' }, children: [_jsx("h3", { style: { fontSize: '16px', marginBottom: '2px' }, children: store.name }), _jsx("span", { style: { color: '#AD5457', fontSize: '16px', marginRight: '6px' }, children: "\u2605 \u2605 \u2605 \u2605 \u2606" }), _jsx("span", { style: { fontSize: '14px', color: '#666' }, children: "(123 \uB9AC\uBDF0)" })] }), _jsx("p", { style: { margin: '4px 0', fontSize: '13px' }, children: store.address }), _jsx("p", { style: { margin: '4px 0', fontSize: '13px' }, children: store.phone })] })] }), store.options?.length > 0 && (_jsxs("div", { style: {
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '6px',
                                        marginTop: '10px',
                                        paddingLeft: '0px',
                                    }, children: [(openOptions[store.name] ? store.options : store.options.slice(0, 3)).map(opt => (_jsxs("span", { style: {
                                                background: '#f5f5f5',
                                                borderRadius: '20px',
                                                padding: '4px 10px',
                                                fontSize: '12px',
                                                color: '#555',
                                            }, children: ["#", opt] }, opt))), store.options.length > 3 && (_jsx("button", { onClick: (e) => {
                                                e.stopPropagation();
                                                setOpenOptions(prev => ({
                                                    ...prev,
                                                    [store.name]: !prev[store.name],
                                                }));
                                            }, style: {
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#0077cc',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                marginTop: '6px',
                                            }, children: openOptions[store.name] ? '간략히 ▲' : '더보기 ▼' }))] }))] }, store.name))), selectedStore && (_jsxs("div", { style: {
                                position: 'absolute',
                                right: '50px',
                                bottom: '120px',
                                width: '260px',
                                background: '#fff',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                                zIndex: 1000
                            }, children: [_jsxs("div", { style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '8px'
                                    }, children: [_jsx("h3", { style: { margin: 0 }, children: selectedStore.name }), _jsx("button", { onClick: () => setSelectedStore(null), style: {
                                                background: 'transparent',
                                                border: 'none',
                                                fontSize: '18px',
                                                cursor: 'pointer',
                                                lineHeight: '1',
                                            }, children: "\u2716" })] }), _jsx("p", { style: { fontSize: '13px', margin: '4px 0' }, children: selectedStore.address }), _jsx("p", { style: { fontSize: '13px', margin: '4px 0' }, children: selectedStore.phone }), _jsx("a", { href: `https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`, target: "_blank", rel: "noopener noreferrer", style: {
                                        fontSize: '13px',
                                        color: '#0077cc',
                                        textDecoration: 'underline',
                                        display: 'inline-block',
                                        marginTop: '10px'
                                    }, children: "\uAE38\uCC3E\uAE30" })] }))] })] })) : (
        // PC코드 시작
        _jsxs("div", { style: { margin: '0 200px' }, children: [_jsx("div", { style: {
                        width: '100%',
                        padding: '20px 0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }, children: _jsxs("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            // margin: '20px 0',
                            border: '1px solid #AD5457',
                            background: '#fff',
                            width: '100%',
                            maxWidth: '650px',
                            boxSizing: 'border-box',
                            marginTop: '140px',
                            height: '40px'
                        }, children: [_jsx("button", { onClick: () => {
                                    if (searchQuery.trim() === '') {
                                        setFilteredStores(storeData);
                                        setSelectedStore(null);
                                    }
                                    else {
                                        const results = storeData.filter(store => store.name.includes(searchQuery));
                                        setFilteredStores(results);
                                        setSelectedStore(results[0] ?? null);
                                    }
                                }, style: {
                                    background: '#AD5457',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    height: '40px',
                                    width: '40px'
                                }, children: _jsx("img", { src: "/img/logo/search.svg", alt: "\uAC80\uC0C9 \uC544\uC774\uCF58", style: { width: '20px', height: '20px' } }) }), _jsx("input", { type: "text", value: searchQuery, placeholder: "\uB0B4\uAC00 \uCC3E\uB294 \uC2DD\uB2F9\uC744 \uAC80\uC0C9\uD574\uBCF4\uC138\uC694.", onFocus: () => setShowMap(true), onChange: (e) => {
                                    const keyword = e.target.value;
                                    setSearchQuery(keyword);
                                    if (keyword.trim() === '') {
                                        setFilteredStores(storeData);
                                        setSelectedStore(null);
                                    }
                                    else {
                                        const results = storeData.filter(store => store.name.includes(keyword));
                                        setFilteredStores(results);
                                        setSelectedStore(results[0] ?? null);
                                    }
                                }, onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        const results = storeData.filter(store => store.name.includes(searchQuery));
                                        setFilteredStores(results);
                                        setSelectedStore(results[0] ?? null);
                                    }
                                }, style: {
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '14px',
                                    background: 'transparent',
                                } })] }) }), _jsx("hr", { style: { borderTop: '1px solid #AD5457', maxWidth: '1230px', margin: '20px auto 10px' } }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', height: '100vh', }, children: [_jsx("div", { style: {
                                display: 'flex',
                                overflowX: 'auto', // ✅ 가로 스크롤 가능
                                whiteSpace: 'nowrap', // ✅ 줄바꿈 없이 한줄
                                gap: '8px',
                                padding: '15px 96px 15px',
                                justifyContent: 'center'
                            }, children: filters.map(({ label, key }) => (_jsxs("button", { onClick: () => toggleFilter(key), style: {
                                    flexShrink: 0, // ✅ 버튼이 줄어들지 않고 유지
                                    padding: '8px 20px',
                                    backgroundColor: activeFilters.includes(key) ? '#AD5457' : '#eee',
                                    color: activeFilters.includes(key) ? '#fff' : '#333',
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '14px'
                                }, children: [label, " ", activeFilters.includes(key) && _jsx("span", { style: { fontWeight: 'bold', fontSize: '14px' }, children: "\u00D7" })] }, key))) }), _jsxs("div", { style: { display: 'flex', flex: 1, overflow: 'hidden', height: '100%', padding: `0 ${paddingSize}`, }, children: [_jsx("div", { style: { flex: 1, maxWidth: '80%', overflowY: 'auto', padding: '20px', boxSizing: 'border-box' }, children: filteredStores.map(store => (_jsxs("div", { style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            background: '#fff',
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            padding: '16px',
                                            marginBottom: '16px',
                                        }, children: [_jsxs("div", { onClick: () => navigate(`/store/${encodeURIComponent(store.name)}`), style: {
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    cursor: 'pointer',
                                                    gap: '16px',
                                                }, children: [_jsx("img", { src: store.image || '/img/default.jpg', alt: store.name, style: {
                                                            width: '230px',
                                                            height: '180px',
                                                            borderRadius: '8px',
                                                            objectFit: 'cover',
                                                            flexShrink: 0,
                                                        } }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h3", { style: { fontSize: '18px', marginBottom: '4px' }, children: store.name }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '8px' }, children: [_jsx("span", { style: { color: '#AD5754', fontSize: '16px', marginRight: '6px' }, children: "\u2605 \u2605 \u2605 \u2605 \u2606" }), _jsx("span", { style: { fontSize: '14px', color: '#666' }, children: "(123 \uB9AC\uBDF0)" })] }), _jsxs("p", { style: { fontSize: '14px', margin: '2px 0' }, children: [_jsx("strong", { children: "\uC8FC\uC18C:" }), " ", store.address] }), _jsxs("p", { style: { fontSize: '14px', margin: '2px 0' }, children: [_jsx("strong", { children: "T." }), " ", store.phone] })] })] }), store.options?.length > 0 && (_jsxs("div", { style: {
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '6px',
                                                    marginTop: '12px'
                                                }, children: [(openOptions[store.name] ? store.options : store.options.slice(0, 5)).map(opt => (_jsxs("span", { style: {
                                                            background: '#f5f5f5',
                                                            borderRadius: '20px',
                                                            padding: '4px 10px',
                                                            fontSize: '12px',
                                                            color: '#555'
                                                        }, children: ["#", opt] }, opt))), store.options.length > 5 && (_jsx("button", { style: {
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: '#0077cc',
                                                            fontSize: '12px',
                                                            cursor: 'pointer',
                                                            marginTop: '6px'
                                                        }, onClick: (e) => {
                                                            e.stopPropagation(); // 상세페이지 이동 방지
                                                            setOpenOptions(prev => ({
                                                                ...prev,
                                                                [store.name]: !prev[store.name] // 이 가게만 토글
                                                            }));
                                                        }, children: openOptions[store.name] ? '간략히 ▲' : '더보기 ▼' }))] }))] }, store.name))) }), _jsxs("div", { style: { width: '40%', height: '100%', position: 'sticky', top: 0, flex: 0.9 }, children: [_jsx("div", { id: "filterMap", style: { width: '100%', height: '100%', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' } }), selectedStore && (_jsxs("div", { style: {
                                                position: 'absolute',
                                                right: '50px',
                                                bottom: '120px',
                                                width: '260px',
                                                background: '#fff',
                                                borderRadius: '12px',
                                                padding: '16px',
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                                                zIndex: 1000
                                            }, children: [_jsxs("div", { style: {
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '8px'
                                                    }, children: [_jsx("h3", { style: { margin: 0 }, children: selectedStore.name }), _jsx("button", { onClick: () => setSelectedStore(null), style: {
                                                                background: 'transparent',
                                                                border: 'none',
                                                                fontSize: '18px',
                                                                cursor: 'pointer',
                                                                lineHeight: '1',
                                                            }, children: "\u2716" })] }), _jsx("p", { style: { fontSize: '13px', margin: '4px 0' }, children: selectedStore.address }), _jsx("p", { style: { fontSize: '13px', margin: '4px 0' }, children: selectedStore.phone }), _jsx("a", { href: `https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`, target: "_blank", rel: "noopener noreferrer", style: {
                                                        fontSize: '13px',
                                                        color: '#0077cc',
                                                        textDecoration: 'underline',
                                                        display: 'inline-block',
                                                        marginTop: '10px'
                                                    }, children: "\uAE38\uCC3E\uAE30" })] }))] })] })] })] })) }));
}
