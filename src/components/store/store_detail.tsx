import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import '/node_modules/swiper/swiper.min.css'
import '/node_modules/swiper/modules/navigation.min.css'
import '/node_modules/swiper/modules/pagination.min.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { storeData, Store } from '../../data/storeData'

export default function StoreDetail() {
  const { name } = useParams()
  const storeName = decodeURIComponent(name || '')
  const selectedStore: Store | undefined = storeData.find((store) => store.name === storeName)

  const imageCount = 4
  const images = Array.from({ length: imageCount }, (_, i) =>
    `/samga/store/${storeName}_${i + 1}.jpg`
  )

  const [storeInfo, setStoreInfo] = useState<any>(null)

  const isMobile = window.innerWidth <= 768
  const isTablet = window.innerWidth <= 1024

  const initialGridColumns = !isMobile ? 6 : isTablet ? 4 : 2


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
  ]



  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-place/v1/search', {
          params: { query: storeName },
          headers: {
            'X-NCP-APIGW-API-KEY-ID': 'b9391ksmhk',
            'X-NCP-APIGW-API-KEY': 'QowSM3dPxevzKk0vfm5hoqXqnOoXIOFmYJKontRM'
          }
        })
        const firstResult = response.data.places?.[0]
        setStoreInfo(firstResult)
      } catch (error) {
        console.error('가게 정보를 가져오는 중 오류 발생:', error)
      }
    }

    if (storeName) fetchStoreData()
  }, [storeName])

  return (
    <div style={{ maxWidth: '1920px', margin: '0 auto', padding: '60px 20px', fontFamily: 'sans-serif' }}>
      {/* 대표 이미지 - Swiper */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={30}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        loop={true}
        style={{ width: '100%', height: '600px', borderRadius: '12px', marginBottom: '40px' }}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={src}
              alt={`${storeName} 대표 이미지 ${idx + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>


      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: '40px',
        marginBottom: '60px',
        marginLeft: isMobile ? '0' : '155px',
      }}>
        {/* 왼쪽 영역 */}
        <div style={{ minWidth: '300px', flex: '0 0 auto' }}>
          {/* 해시태그 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {selectedStore?.hashtag.map((tag, i) => (
              <span key={i} style={{
                background: '#f5f5f5',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                color: '#333'
              }}>{tag}</span>
            ))}
          </div>

          {/* 가게정보 카드 (로고 포함) */}
          <div
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '10px',
              maxWidth: '360px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              lineHeight: 1.4
            }}
          >
            {/* 로고 */}
            <div style={{ marginBottom: '4px' }}>
              <img src={selectedStore?.logo} alt="로고" style={{ height: '70px', display: 'block', margin: '0 auto' }} />
            </div>

            <h2
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#222',
                margin: '0 0 10px 0',
                // textAlign: 'center'
              }}
            >
              {selectedStore?.name}
            </h2>

            <p style={{ margin: '2px 0', fontSize: '14px' }}>
              <strong>📍 주소:</strong> {selectedStore?.address}
            </p>
            <p style={{ margin: '2px 0', fontSize: '14px' }}>
              <strong>📞 전화번호:</strong> {selectedStore?.phone}
            </p>
            <p style={{ margin: '2px 0', fontSize: '14px' }}>
              <strong>⏰ 영업시간:</strong> {selectedStore?.hours}
            </p>
            {selectedStore?.point && (
              <p style={{ margin: '6px 0 0', color: '#C8102E', fontStyle: 'italic', fontSize: '13px' }}>
                ⚠️ {selectedStore.point}
              </p>
            )}
          </div>


        </div>

        {/* 오른쪽 영역 전체 */}
        <div style={{ flex: 1 }}>
          {/* 상단 버튼들 */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
            gap: '16px',
            marginBottom: '10px',
          }}>
            {['📝리뷰 작성', '💖즐겨찾기', '📌단골 등록'].map((label, i) => (
              <button
                key={i}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                  backgroundColor: '#f8f8f8',
                  fontSize: '14px',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => alert(`${label} 눌렀다!`)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 편의시설 아이콘 - border 포함, 반응형 2줄 */}
          <div
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '16px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
              maxWidth:'700px'
            }}
          >
            {amenityIcons.map((file, i) => {
              const key = file.replace('.jpg', '')
              const isActive = selectedStore?.options.includes(key)
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    wordBreak: 'keep-all',
                    whiteSpace: 'normal',
                    maxWidth: '80px',
                    opacity: isActive ? 1 : 0.3,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <img
                    src={`/img/amenities/${file}`}
                    alt={key}
                    style={{
                      width: '36px',
                      height: '36px',
                      objectFit: 'contain',
                      marginBottom: '4px'
                    }}
                  />
                  <p style={{
                    fontSize: '13px',
                    color: '#444',
                    lineHeight: '1.3',
                    textAlign: 'center',
                    margin: 0
                  }}>{key}</p>
                </div>
              )
            })}
          </div>
        </div>



      </div>



      {/* 고기 + 대표 이미지 + 스토리 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '80px', // 이미지와 스토리 사이 여백
        margin: '200px auto 500px',
        maxWidth: '1400px',
        position: 'relative'
      }}>
        {/* 이미지 묶음 */}
        <div style={{ position: 'relative', width: '500px', height: '420px', flex: 1, }}>
          {/* 고기 이미지 (조금 아래로 내려줌) */}
          <div style={{
            position: 'absolute',
            bottom: '-300px', // 👈 여기서 살짝 내려줌
            left: '-100px',
            width: '600px',
            height: '400px',
            borderRadius: '8px',
            overflow: 'hidden',
            zIndex: 1,
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
          }}>
            <img
              src={selectedStore?.meatimage}
              alt="고기"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* 대표 이미지 */}
          <div style={{
            position: 'absolute',
            top: '30px',
            left: '150px',
            width: '500px',
            height: '500px',
            borderRadius: '8px',
            overflow: 'hidden',
            zIndex: 2,
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
          }}>
            <img
              src={images[0]}
              alt="대표 이미지"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* 스토리 */}
        <div style={{
          flex: 1,
          minWidth: '0', // flex item이 너무 넓어지지 않게
          maxWidth: '600px',
          textAlign: 'left',
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#333'
        }}>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>
            {selectedStore?.name}의 스토리
          </h3>
          <p style={{ whiteSpace: 'pre-line' }}>
            {selectedStore?.story}
          </p>
        </div>
      </div>


      {/* 상세 이미지들 */}
      <h3 style={{ marginBottom: '16px' }}>📸 가게 상세 이미지</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '60px'
      }}>
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={`${storeName} 상세 ${idx + 1}`} style={{ width: '100%', borderRadius: '8px' }} />
        ))}
      </div>

      {/* 리뷰 영역 */}
      <h3>📝 리뷰</h3>
      <div style={{
        background: '#f2f2f2',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#999'
      }}>
        <p>아직 등록된 리뷰가 없습니다. 첫 리뷰를 남겨보세요!</p>
      </div>
    </div>
  )
}
