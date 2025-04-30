import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { storeData } from '../../data/storeData'
import './storeDetail.css'
import { storeDetailAssets } from '../../data/storeDetailAssets'

const tabs = ['가게메뉴', '상차림', '편의시설'] as const
type Tab = typeof tabs[number]

export default function StoreDetail() {
    const { name } = useParams()
    const storeName = decodeURIComponent(name || '')
    const selectedStore = storeData.find((s) => s.name === storeName)
    const [activeTab, setActiveTab] = useState<Tab>('가게메뉴')
    const [showAllFacilities, setShowAllFacilities] = useState(false)
    const titles = storeDetailAssets[selectedStore.name] || []


    const facilityIcons: Record<string, string> = {
        '주문배송': '/img/amenities/주문배송.svg',
        '무료wifi': '/img/amenities/무료wifi.svg',
        '남여화장실구분': '/img/amenities/남여화장실구분.svg',
        '단체이용예약가능': '/img/amenities/단체이용예약가능.svg',
        '주차장': '/img/amenities/주차장.svg',
        '제로페이': '/img/amenities/제로페이.svg',
        '유아의자': '/img/amenities/유아의자.svg',
    }



    const tabToFolderMap: Record<Tab, string> = {
        '가게메뉴': 'menu',
        '상차림': 'side',
        '편의시설': 'amenities',
    }

    const currentFolder = tabToFolderMap[activeTab]
    const MAX_IMAGES = 10
    const imageCandidates = Array.from({ length: MAX_IMAGES }, (_, i) => `${storeName}_${i + 1}`)

    if (!selectedStore) return <div>가게 정보를 찾을 수 없습니다.</div>

    return (
        <div className="store-detail-wrapper">
            {/* 👇 대표 이미지 */}
            <div
                className="store-hero-image"
                style={{ backgroundImage: `url(${selectedStore.detailimage})` }}
            />

            {/* 👇 가게 정보 카드 */}
            <div className="store-info-card">
                <img src={selectedStore.logo} alt="로고" className="store-main-logo" />
                <div className="store-name-stars">
                    <h2 className="store-name">{selectedStore.name}</h2>
                    <div className="star-icons">★★★★★</div>
                </div>
                <div className="store-detail">
                    <span className="label">영업시간 :</span> {selectedStore.hours.split('/')[0]}
                    {selectedStore.point && (
                        <span className="point"> ※ {selectedStore.point}</span>
                    )}
                </div>
                <div className="store-detail">
                    <span className="label">휴무 :</span> {selectedStore.hours.split('/')[1].replace('휴무', '')}
                </div>

                <div className="store-actions">
                    <div className="action-item">
                        <img src="/img/icon/길찾기.svg" alt="길찾기" />
                        <span>길찾기</span>
                    </div>
                    <div className="action-item">
                        <img src="/img/icon/공유하기.svg" alt="공유하기" />
                        <span>공유하기</span>
                    </div>
                    <div className="action-item">
                        <img src="/img/icon/단골등록.svg" alt="단골등록" />
                        <span>단골등록</span>
                    </div>
                    <div className="action-item">
                        <img src="/img/icon/리뷰쓰기.svg" alt="리뷰쓰기" />
                        <span>리뷰쓰기</span>
                    </div>
                </div>

                <div className="facility-section">
                    <div className="facility-title">편의시설</div>
                    <div className="facility-icons">
                        {(showAllFacilities ? selectedStore.options : selectedStore.options.slice(0, 4)).map(option => (
                            facilityIcons[option] && (
                                <div className="facility-icon" key={option}>
                                    <img src={facilityIcons[option]} alt={option} />
                                    <p>{option}</p>
                                </div>
                            )
                        ))}
                    </div>
                    <div className="button-location">
                        {selectedStore.options.length > 4 && (
                            <button
                                className="more-button"
                                onClick={() => setShowAllFacilities(prev => !prev)}
                            >
                                {showAllFacilities
                                    ? '간략히 보기 ▲'
                                    : `+${selectedStore.options.length - 4}개 더보기 ▼`}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 👇 가게 소개 스토리 */}
            <div className="store-story-wrapper">

                <div className="store-slogan">
                    {selectedStore.description.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            </div>

            <div className="brand-inner">

                {/* 👇 브랜드 로고 + 서브로고 */}
                <div className="store-brand-wrapper">
                    <img src="/img/logo/videologo.svg" alt="videologo" className="video-logo" />
                    <div className="brand-text">KOREAN BEEF VILLAGE SAMGA</div>
                    <hr className="brand-divider" />
                    <img src={selectedStore.logo} alt="logo" className="store-sub-logo" />
                </div>

            </div>

            {/* 👇 PC / M 상세 이미지 분리 출력 */}
            <div className="store-detail-images-separated">
                {/* PC 환경일 때만 보여짐 */}
                <div className="detail-images-pc only-pc">
                    {selectedStore.detailImagelist
                        .filter((src) => src.includes('PC'))
                        .map((src, idx) => (
                            <div className="pc-image-wrapper" key={`pc-${idx}`}>
                                <img
                                    src={src}
                                    alt={`PC 상세 이미지 ${idx + 1}`}
                                    className="store-image"
                                />
                                {titles[idx] && (
                                    <div className={`pc-image-text-overlay ${titles[idx].className}`}>
                                        {titles[idx].text.split('\n').map((line, i) => (
                                            <div key={i}>{line}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>

                {/* 모바일 환경일 때만 보여짐 */}
                <div className="detail-images-mobile only-mobile">
                    {selectedStore.detailImagelist
                        .filter((src) => src.includes('M'))
                        .map((src, idx) => (
                            <img
                                key={`m-${idx}`}
                                src={src}
                                alt={`모바일 상세 이미지 ${idx + 1}`}
                                className="store-image"
                            />
                        ))}
                </div>
            </div>



            {/* 👇 상세 이미지 탭 */}
            <div className="store-detail-top-wrapper">
                <h2 className="section-title">가게 상세 이미지</h2>

                {/* 탭 버튼들 */}
                <div className="tab-buttons">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 탭별 이미지 리스트 */}
                <div className="store-images">
                    {imageCandidates.map((name, idx) => (
                        ['.jpg', '.JPG', '.png'].map((ext) => {
                            const src = `/samga/store/${currentFolder}/${name}${ext}`
                            return (
                                <img
                                    key={src}
                                    src={src}
                                    alt={`${storeName} ${activeTab} 이미지 ${idx + 1}`}
                                    className="store-image"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none'
                                    }}
                                />
                            )
                        })
                    ))}
                </div>
            </div>



            <div className="store-review-wrapper">

                <div className='review-item'>
                    <img src='/img/icon/리뷰쓰기.svg' alt="리뷰제목" />
                    <span>리뷰쓰기</span>
                </div>

                {/* 등록된 리뷰가 아직 없을 때 기본 안내 */}
                <div className="review-placeholder">
                    <p>아직 등록된 리뷰가 없습니다. 첫 리뷰를 남겨보세요!</p>
                    {/* 네이버 리뷰 보러가기 버튼 */}
                    <a
                        href={`https://search.naver.com/search.naver?query=${encodeURIComponent(storeName)} 리뷰`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="naver-review-link"
                    >
                        네이버 리뷰 보러가기 →
                    </a>
                </div>
            </div>


        </div>
    )
}
