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

      
        {/* 가게 정보 카드 */}
      {selectedStore && (
        <div
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            margin: '0 ',
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            lineHeight: '1.6'
          }}
        >
          <h2 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: 'bold', color: '#222' }}>{selectedStore.name}</h2>
          <p style={{ margin: '6px 0', fontSize: '16px', color: '#666' }}><strong>📍 주소:</strong> {selectedStore.address}</p>
          <p style={{ margin: '6px 0', fontSize: '16px', color: '#666' }}><strong>📞 전화번호:</strong> {selectedStore.phone}</p>
          <p style={{ margin: '6px 0', fontSize: '16px', color: '#666' }}><strong>⏰ 영업시간:</strong> {selectedStore.hours}</p>
          {selectedStore.point && (
            <p style={{ margin: '6px 0', fontSize: '16px', fontStyle: 'italic', color: '#C8102E' }}>⚠️ {selectedStore.point}</p>
          )}
        </div>
      )}


      

      {/* 스토리 설명 */}
      <div style={{ flex: 2, maxWidth: '1000px', margin: '60px auto' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>스토리</h3>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#555' }}>
          {storeName}은(는) 합천군 삼가면에 위치한 한우 전문점으로,
          지역 주민들에게 신뢰받는 맛과 정성으로 알려져 있습니다.
          신선한 고기와 정갈한 상차림, 정겨운 분위기로 많은 이들이 찾는 명소입니다.
        </p>
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