import React, { useEffect, useRef, useState } from 'react'
import { storeData, Store } from '../data/storeData'

const filters = [
  { label: '유아용 좌석 있음', key: 'babySeat' },
  { label: '단체석 가능', key: 'groupSeat' },
  { label: '예약 가능', key: 'reservation' },
]

export default function StoreFilterPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const overlaysRef = useRef<any[]>([])

  // 필터에 따라 스토어 갱신
  useEffect(() => {
    const stores = storeData.filter(store =>
      activeFilters.every(filterKey => store.options?.includes(filterKey))
    )
    setFilteredStores(stores)
  }, [activeFilters])

  // 지도 초기화 (한 번만 실행)
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d65716a4db9e8a93aaff1dfc09ee36b8`
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('filterMap')
        if (!container) return

        const options = {
          center: new window.kakao.maps.LatLng(35.413, 128.123),
          level: 4
        }

        const map = new window.kakao.maps.Map(container, options)
        mapRef.current = map

        // 초기 마커 렌더링
        updateMarkers(storeData)
      })
    }
    document.head.appendChild(script)
  }, [])

  // 마커/오버레이 업데이트 함수
  const updateMarkers = (stores: Store[]) => {
    const map = mapRef.current
    if (!map) return

    // 기존 마커 & 오버레이 제거
    markersRef.current.forEach(marker => marker.setMap(null))
    overlaysRef.current.forEach(overlay => overlay.setMap(null))
    markersRef.current = []
    overlaysRef.current = []

    stores.forEach(store => {
      const position = new window.kakao.maps.LatLng(store.lat, store.lng)

      const marker = new window.kakao.maps.Marker({ position, map })
      markersRef.current.push(marker)

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: `
          <div style="
            padding: 6px 12px;
            background: white;
            border-radius: 8px;
            font-size: 13px;
            font-weight: bold;
            color: #333;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            border: 1px solid #ddd;
            white-space: nowrap;
            text-align: center;
          ">
            ${store.name}
          </div>
        `,
        yAnchor: 2
      })

      overlay.setMap(map)
      overlaysRef.current.push(overlay)
    })
  }

  // 필터 바뀌면 마커 업데이트
  useEffect(() => {
    if (mapRef.current) {
      updateMarkers(filteredStores)
    }
  }, [filteredStores])

  const toggleFilter = (key: string) => {
    setActiveFilters(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', width: '100%' }}>
      {/* 필터 버튼 */}
      <div style={{ display: 'flex', gap: '8px', padding: '20px', justifyContent: 'center' }}>
        {filters.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            style={{
              padding: '8px 16px',
              backgroundColor: activeFilters.includes(key) ? '#C8102E' : '#eee',
              color: activeFilters.includes(key) ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 레이아웃 */}
      <div style={{ display: 'flex', padding: '0 40px', gap: '40px' }}>
        {/* 왼쪽: 스크롤 가능한 가게 리스트 */}
        <div style={{
          width: '60%',
          maxHeight: '900px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingRight: '12px'
        }}>
          {filteredStores.map(store => (
            <div
              key={store.name}
              style={{
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '16px'
              }}
            >
              <h3>{store.name}</h3>
              <p>{store.address}</p>
              <p>{store.phone}</p>
              {store.options?.length > 0 && (
                <ul style={{ fontSize: '14px', color: '#666' }}>
                  {store.options.map(opt => <li key={opt}>✔ {opt}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* 오른쪽: 지도 영역 */}
        <div style={{ flex: 1 }}>
          <div
            id="filterMap"
            style={{
              width: '100%',
              height: '900px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
