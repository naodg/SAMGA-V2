import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { storeData } from '../data/storeData';
import './storelist.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
const bannerImages = [
    {
        src: '/img/banner/banner1.png',
        caption: '좋은사람과 같이 걷기 좋은 \n 삼가특화거리-소화잘되는 길',
        link: 'https://blog.naver.com/hc-urc/222571944010',
    },
    {
        src: '/img/banner/banner2.png',
        caption: '4계절 각기다른 멋! 황매산 군립공원 \n 공식사이트 바로가기',
        link: 'https://www.hc.go.kr/09418/09425/09833.web'
    },
    {
        src: '/img/banner/banner3.png',
        caption: '생명의 아름다운 멋으로 가득한 정양늪 \n 공식사이트 바로가기',
        link: 'https://www.youtube.com/watch?v=DjprccTSapc'
    },
    {
        src: '/img/banner/banner4.png',
        caption: '삼가의 멋-삼가시장 \n합천 공식유튜브 바로가기',
        link: 'https://www.youtube.com/watch?v=ZLch32VzUb0'
    },
    {
        src: '/img/banner/banner5.png',
        caption: '영화같은일상 합천영상테마파크 \n 공식사이트 바로가기',
        link: 'https://hcmoviethemepark.com/'
    },
];
export default function StoreList() {
    const isMobile = window.innerWidth <= 768;
    const navigate = useNavigate();
    const handleStoreClick = (storeName) => {
        navigate(`/store/${encodeURIComponent(storeName)}`);
    };
    return (_jsxs("div", { className: "storelist-landing", children: [_jsxs("div", { className: "landing-video-wrapper", children: [_jsx("img", { src: "/img/logo/videologo.svg", alt: "\uC0BC\uAC00\uD55C\uC6B0\uB85C\uACE0", className: "landing-logo" }), _jsx("video", { src: "/video/\uD569\uCC9C\uC601\uC0C1.mp4", width: "85%", 
                        // height="400px"
                        muted: true, loop: true, playsInline: true, controls: true, style: { borderRadius: '12px', padding: '110px 0 0' } })] }), _jsxs("div", { className: "landing-text", children: [_jsx("img", { src: "/img/logo/tasty.svg", alt: "tasty", className: "tasty" }), _jsxs("h2", { className: "landing-title", children: ["\uC0BC\uAC00\uC5D0\uC120 \uD55C\uC6B0\uAC00 \uC77C\uC0C1,", _jsx("br", {}), "\uB9E4\uC77C \uD2B9\uBCC4\uD55C \uACE0\uAE30 \uD55C \uB07C"] }), _jsx("hr", { className: "landing-divider" }), _jsx("p", { className: "landing-tagline", children: "KOREAN BEEF VILLAGE SAMGA" })] }), _jsxs("div", { className: "store-card-grid", children: [storeData.map((store, index) => {
                        const offsetY = [0, 50, 10][index % 3];
                        return (_jsxs("div", { className: "store-card-wrapper", children: [_jsxs("h3", { className: "store-title", style: {
                                        transform: isMobile ? '' : `translateY(${offsetY}px)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px' // 텍스트랑 아이콘 사이 여백
                                    }, children: [_jsx("img", { src: "/img/logo/\uC81C\uBAA9\uC606\uC544\uC774\uCF58.svg", alt: "\uC544\uC774\uCF58", style: {
                                                width: '18px',
                                                height: '18px',
                                                objectFit: 'contain'
                                            } }), store.name] }), _jsxs("div", { className: "store-card", style: {
                                        transform: isMobile ? '' : `translateY(${offsetY}px)`
                                    }, onClick: () => handleStoreClick(store.name), children: [_jsx("img", { src: store.image, alt: store.name, className: "store-card-image" }), _jsxs("div", { className: `store-card-textbox ${store.name === '대가식육식당' ? 'center-text' : ''}`, children: [_jsx("h3", { className: "store-desc", children: store.slogan }), store.slogan2 && (_jsx("p", { className: "store-subdesc", children: store.slogan2 })), _jsx("button", { className: "store-button", children: "\uC790\uC138\uD788 \uBCF4\uAE30" })] })] })] }));
                    }), _jsxs("div", { className: "store-card-wrapper", children: [_jsxs("h3", { className: "store-title", style: {
                                    // transform: isMobile ? '' : `translateY(${offsetY}px)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px' // 텍스트랑 아이콘 사이 여백
                                }, children: [_jsx("img", { src: "/img/logo/\uC81C\uBAA9\uC606\uC544\uC774\uCF58.svg", alt: "\uC544\uC774\uCF58", style: {
                                            width: '18px',
                                            height: '18px',
                                            objectFit: 'contain'
                                        } }), "\u725B\uB9AC\uB9C8\uC744"] }), _jsx("div", { className: "store-card", children: _jsx("img", { src: "/samga/store/소탈이.jpg", alt: "소탈이", className: "store-card-image" }) })] })] }), _jsxs("div", { className: "banner-wrapper", children: [_jsxs("div", { className: "banner-title-area", children: [_jsx("img", { src: "/img/logo/bannerlogo.svg", alt: "\uD0C0\uC774\uD2C0\uB85C\uACE0", className: "slogan-img" }), _jsxs("div", { className: "banner-subtitle", children: [_jsx("span", { className: "bolder", children: "\uB9DB!" }), "\uC788\uB294", _jsx("span", { className: "bolder", children: "\uBA4B!" }), "\uC788\uB294 \uC88B\uC740", _jsx("span", { className: "bolder", children: "\uC0AC\uB78C" }), "\uACFC"] }), _jsx("div", { className: "banner-title", children: "\uAC00\uBCFC\uB9CC\uD55C \uACF3?" })] }), _jsx(Swiper, { modules: [Navigation, Autoplay], pagination: { clickable: false }, autoplay: { delay: 2000 }, loop: true, spaceBetween: 20, slidesPerView: 2, breakpoints: {
                            768: {
                                slidesPerView: 4,
                            },
                        }, className: "banner-swiper", children: bannerImages.map((item, index) => (_jsx(SwiperSlide, { className: "banner-slide", children: _jsxs("a", { href: item.link, target: "_blank", rel: "noopener noreferrer", className: "banner-link", children: [_jsx("img", { src: item.src, alt: `배너${index + 1}`, className: "banner-img" }), _jsx("div", { className: "banner-hover-caption", children: _jsx("p", { children: item.caption }) })] }) }, index))) })] })] }));
}
