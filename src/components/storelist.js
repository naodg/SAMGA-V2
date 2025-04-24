import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { storeData } from '../data/storeData';
export default function StoreList() {
    const isMobile = window.innerWidth <= 768;
    const navigate = useNavigate();
    const handleStoreClick = (storeName) => {
        navigate(`/store/${encodeURIComponent(storeName)}`);
    };
    return (_jsxs("div", { style: { margin: '100px 0', fontFamily: 'sans-serif' }, children: [_jsx("div", { style: { background: '#637472', width: '100%' }, children: _jsxs("div", { style: {
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        gap: isMobile ? '30px' : '80px', // ✅ gap 조절
                        maxWidth: '1490px',
                        margin: '100px auto',
                        padding: isMobile ? '40px 20px' : '40px 100px', // ✅ PC일 때 padding 좌우 증가시켜 내부를 가운데로 밀어줌
                        textAlign: isMobile ? 'center' : 'left', // 👉 모바일일 때만 중앙 정렬
                        alignItems: isMobile ? 'center' : 'center' // 👉 글씨 전체 가운데 배치
                    }, children: [_jsxs("div", { style: { width: isMobile ? '100%' : '45%' }, children: [_jsx("h2", { style: { fontSize: '24px', marginBottom: '12px', color: '#fff' }, children: "\uC0BC\uAC00\uD55C\uC6B0 \uD504\uB85C\uBAA8\uC158" }), _jsxs("p", { style: { fontSize: '26px', lineHeight: '1.6', color: '#ccc' }, children: ["\uC0BC\uAC00\uC5D0\uC120 \uD55C\uC6B0\uAC00 \uC77C\uC0C1,", _jsx("br", {}), "\uB9E4\uC77C\uC774 \uD2B9\uBCC4\uD55C \uACE0\uAE30 \uD55C \uB07C"] })] }), _jsx("div", { style: { width: isMobile ? '100%' : '45%' }, children: _jsx("video", { src: "/video/\uD569\uCC9C\uC601\uC0C1.mp4", width: "100%", height: "400px", muted: true, loop: true, playsInline: true, controls: true, style: { borderRadius: '12px' } }) })] }) }), _jsx("div", { style: {
                    position: 'relative',
                    maxWidth: '1485px',
                    margin: '200px auto',
                    padding: '0 20px',
                }, children: _jsx("div", { style: {
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                        gap: '48px',
                        position: 'relative',
                        zIndex: 1,
                    }, children: storeData.map((store, index) => {
                        const offsetY = [0, -60, 10][index % 3];
                        return (_jsxs("div", { style: {
                                background: 'transparent',
                                height: '500px',
                                position: 'relative',
                                cursor: 'pointer',
                                transform: isMobile ? '' : `translateY(${offsetY}px)`,
                                zIndex: 1,
                                borderRadius: '0px',
                                overflow: 'visible',
                                // border: '1px solid #333',
                                boxShadow: '0 5px 10px rgba(0,0,0,0.7)',
                            }, onClick: () => handleStoreClick(store.name), children: [_jsx("img", { src: store.image, alt: store.name, style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                        borderRadius: 0,
                                    } }), _jsxs("div", { style: {
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '35%',
                                        background: 'rgba(0, 0, 0, 0.55)',
                                        padding: '12px 16px',
                                        color: '#fff',
                                        boxSizing: 'border-box',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }, children: [_jsxs("div", { style: {
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                            }, children: [_jsx("h3", { style: { margin: 0, fontSize: '18px', fontWeight: '100' }, children: store.name }), _jsx("p", { style: {
                                                        margin: '6px 0 0',
                                                        fontSize: '28px',
                                                        whiteSpace: 'pre-line',
                                                        lineHeight: '1.1',
                                                        fontWeight: 'bold',
                                                    }, children: store.description })] }), _jsx("p", { style: {
                                                fontSize: '13px',
                                                marginTop: '12px',
                                                marginBottom: '10px',
                                                opacity: 0.85,
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }, children: (store.story.length > 40 ? store.story.slice(0, 40) + '...' : store.story) })] })] }, index));
                    }) }) })] }));
}
