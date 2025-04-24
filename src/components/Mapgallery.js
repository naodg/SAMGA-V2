import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import '/node_modules/swiper/swiper.min.css';
import '/node_modules/swiper/modules/navigation.min.css';
import '/node_modules/swiper/modules/pagination.min.css';
import { storeData } from '../data/storeData';
import { useNavigate } from 'react-router-dom';
export default function MapGallery() {
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [swiperIndex, setSwiperIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [showMapPopup, setShowMapPopup] = useState(false);
    const [showStoreInfo, setShowStoreInfo] = useState(false);
    const mapRef = useRef(null);
    // const activeOverlayRef = useRef<any>(null)
    const navigate = useNavigate();
    const handleMarkerClick = (store) => {
        setSelectedStore(store);
        setShowStoreInfo(true);
        if (isMobile)
            setShowMapPopup(true);
    };
    const handleCloseInfo = () => {
        setSelectedStore(null);
        setShowStoreInfo(false);
        if (mapRef.current) {
            mapRef.current.setLevel(4);
            mapRef.current.panTo(new window.kakao.maps.LatLng(35.413, 128.123));
        }
    };
    useEffect(() => {
        if (selectedStore && mapRef.current) {
            mapRef.current.setLevel(2);
            mapRef.current.panTo(new window.kakao.maps.LatLng(selectedStore.lat, selectedStore.lng));
        }
    }, [selectedStore]);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        if (selectedStore) {
            const images = isMobile
                ? [`/img/samga/store/${selectedStore.name}_디테일_1.png`]
                : Array.from({ length: 4 }, (_, i) => `/samga/store/${selectedStore.name}_${i + 1}.jpg`);
            setSelectedImages(images);
        }
        else {
            setSelectedImages([]);
        }
    }, [selectedStore, isMobile]);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d65716a4db9e8a93aaff1dfc09ee36b8`;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapId = isMobile && showMapPopup ? 'mapPopup' : 'map';
                const container = document.getElementById(mapId);
                if (!container)
                    return;
                const map = new window.kakao.maps.Map(container, {
                    center: new window.kakao.maps.LatLng(35.413, 128.123),
                    level: 4
                });
                mapRef.current = map;
                storeData.forEach((store) => {
                    const position = new window.kakao.maps.LatLng(store.lat, store.lng);
                    const marker = new window.kakao.maps.Marker({ position, map, title: store.name });
                    window.kakao.maps.event.addListener(marker, 'click', () => {
                        setSelectedStore(store);
                        const latlng = new window.kakao.maps.LatLng(store.lat, store.lng);
                        mapRef.current.setLevel(1); // 👈 확대 레벨
                        mapRef.current.panTo(latlng); // 👈 해당 위치로 이동
                    });
                    const overlayId = `store-label-${store.name}`;
                    const overlayContent = document.createElement('div');
                    overlayContent.innerText = store.name;
                    overlayContent.style.cssText = `
  cursor: pointer;
  padding: 6px 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  font-size: 13px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  border: 1px solid #ddd;
`;
                    overlayContent.onclick = () => {
                        setSelectedStore(store);
                        setShowStoreInfo(true);
                    };
                    const overlay = new window.kakao.maps.CustomOverlay({
                        position,
                        content: overlayContent,
                        yAnchor: 1.5
                    });
                    overlay.setMap(map);
                    setTimeout(() => {
                        const label = document.getElementById(overlayId);
                        if (label) {
                            label.addEventListener('click', () => {
                                handleMarkerClick(store);
                            });
                        }
                    }, 0);
                });
            });
        };
        document.head.appendChild(script);
    }, [isMobile, showMapPopup]);
    if (typeof window !== 'undefined') {
        window.handleStoreClick = (name) => {
            const target = storeData.find((s) => s.name === name);
            if (target)
                handleMarkerClick(target);
        };
    }
    return (_jsxs("div", { style: {
            position: 'relative',
            display: isMobile ? 'block' : 'flex',
            width: '100%',
            height: isMobile ? 'auto' : '80vh',
            overflow: 'hidden',
            paddingBottom: isMobile ? '40px' : '0'
        }, children: [_jsxs("div", { style: {
                    flex: 1,
                    width: '100%',
                    height: isMobile ? '360px' : '600px',
                    backgroundColor: '#000',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }, children: [_jsxs("div", { style: {
                            position: 'relative',
                            width: '100%',
                            height: isMobile ? '97%' : '95%',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
                            borderRadius: isMobile ? '48px' : '70px',
                            overflow: 'hidden'
                        }, children: [_jsx(Swiper, { modules: [Navigation, Pagination, Autoplay], pagination: { clickable: true }, autoplay: { delay: 2000 }, loop: true, onSlideChange: (swiper) => setSwiperIndex(swiper.realIndex), style: { width: '100%', height: '100%' }, children: (isMobile
                                    ? [
                                        '/samga/store/대가1호점_디테일_1.png',
                                        '/samga/store/대가식육식당_디테일_1.png',
                                        '/samga/store/대가한우_디테일_1.png',
                                        '/samga/store/대산식육식당_디테일_1.png'
                                    ]
                                    : selectedImages.length > 0
                                        ? selectedImages
                                        : [
                                            '/img/landing/대가1호점_1.png',
                                            '/img/landing/대가식육식당_1.png',
                                            '/img/landing/대가한우_1.png',
                                            '/img/landing/대산식육식당_1.png'
                                        ]).map((src, i) => (_jsx(SwiperSlide, { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' }, children: _jsx("img", { src: src, alt: `slide-${i}`, style: { width: '100%', height: '100%', objectFit: 'cover' } }) }, i))) }), _jsx("div", { style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#7d644e',
                                    opacity: 0.32,
                                    pointerEvents: 'none',
                                    zIndex: 5
                                } })] }), isMobile && (_jsx("button", { onClick: () => setShowMapPopup(true), style: {
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            zIndex: 50,
                            padding: '6px 12px',
                            fontSize: '14px',
                            backgroundColor: '#fff',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }, children: "\uC9C0\uB3C4 \uC5F4\uAE30" }))] }), !isMobile && (_jsx("div", { style: {
                    width: '450px',
                    height: '350px',
                    position: 'absolute',
                    bottom: '0px',
                    left: '210px',
                    zIndex: 100,
                    borderRadius: '15px',
                    overflow: 'hidden',
                    border: '1px solid #333'
                }, children: _jsx("div", { id: "map", style: { width: '100%', height: '100%' } }) })), showStoreInfo && selectedStore && (_jsxs("div", { style: {
                    position: 'absolute',
                    top: isMobile ? 'calc(100% - 240px)' : '160px',
                    left: isMobile ? '50%' : '280px',
                    transform: isMobile ? 'translateX(-50%)' : undefined,
                    width: '300px',
                    background: 'rgba(255,255,255,0.95)',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.7)',
                    zIndex: 1000
                }, children: [_jsxs("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }, children: [_jsx("h3", { style: { margin: 0 }, children: selectedStore.name }), _jsx("button", { onClick: handleCloseInfo, style: {
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    color: '#c8102e',
                                    lineHeight: 1
                                }, children: "\u00D7" })] }), _jsx("p", { style: { fontSize: '13px', whiteSpace: 'pre-line' }, children: selectedStore.description }), _jsxs("p", { style: { fontSize: '13px', }, children: ["\uC8FC\uC18C: ", selectedStore.address] }), _jsxs("p", { style: { fontSize: '13px', }, children: ["\uBC88\uD638: ", selectedStore.phone] }), _jsxs("p", { style: { fontSize: '13px', }, children: ["\uC601\uC5C5\uC2DC\uAC04: ", selectedStore.hours] }), _jsx("p", { style: { fontSize: '13px', }, children: selectedStore.point }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }, children: [_jsx("a", { href: `https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`, target: "_blank", rel: "noopener noreferrer", style: {
                                    fontSize: '13px',
                                    color: '#0077cc',
                                    textDecoration: 'underline',
                                }, children: "\uD83D\uDCCD \uAE38\uCC3E\uAE30" }), _jsx("button", { onClick: () => navigate(`/store/${encodeURIComponent(selectedStore.name)}`), style: {
                                    padding: '6px 12px',
                                    fontSize: '13px',
                                    backgroundColor: '#C8102E',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    width: 'fit-content'
                                }, children: "\uC0C1\uC138\uD398\uC774\uC9C0 \uBCF4\uAE30" })] })] })), isMobile && showMapPopup && (_jsxs("div", { style: {
                    position: 'fixed',
                    bottom: '70px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    height: '320px',
                    background: '#fff',
                    borderRadius: '15px',
                    zIndex: 999,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    overflow: 'hidden'
                }, children: [_jsx("div", { id: "mapPopup", style: { width: '100%', height: '100%' } }), _jsx("button", { onClick: () => setShowMapPopup(false), style: {
                            position: 'absolute',
                            top: '6px',
                            right: '10px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: '#c8102e',
                            zIndex: 1000
                        }, children: "\u00D7" })] }))] }));
}
