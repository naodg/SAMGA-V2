import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { storeData } from '../data/storeData';
import './MapGallery.css'


export default function MapGallery() {
  const [selectedStore, setSelectedStore] = useState<typeof storeData[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState(storeData);
  const [showMap, setShowMap] = useState(false)
  const [showStoreInfo, setShowStoreInfo] = useState(false)
  const mapRef = useRef(null);



  const handleMarkerClick = (store: typeof storeData[0]) => {
    setSelectedStore(store)
    setShowStoreInfo(true)


  }


  useEffect(() => {
    // Kakao Map SDK 로딩
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d65716a4db9e8a93aaff1dfc09ee36b8`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) return;

        // 맵 생성
        const map = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(35.413, 128.123),
          level: 4
        });
        mapRef.current = map;

        // 마커 & 오버레이 생성
        filteredStores.forEach((store) => {
          const position = new window.kakao.maps.LatLng(store.lat, store.lng);

          // 마커
          const marker = new window.kakao.maps.Marker({
            position,
            map,
            title: store.name
          });

          // 마커 클릭 시 이벤트
          window.kakao.maps.event.addListener(marker, 'click', () => {
            setSelectedStore(store);
            map.setLevel(1);
            map.panTo(position);
          });

          // 오버레이
          const overlayContent = document.createElement('div');
          overlayContent.id = `store-label-${store.name}`;
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
          };

          const overlay = new window.kakao.maps.CustomOverlay({
            position,
            content: overlayContent,
            yAnchor: 1.5
          });

          requestAnimationFrame(() => {
            overlay.setMap(map);
          });
        });

        // 가게가 하나일 경우 포커스
        if (filteredStores.length === 1) {
          const target = filteredStores[0];
          map.setCenter(new window.kakao.maps.LatLng(target.lat, target.lng));
          map.setLevel(3);
        }
      });
    };
    document.head.appendChild(script);
  }, [showMap, filteredStores]);



  useEffect(() => {
    if (!showMap) return

    const container = document.getElementById('map')
    if (!container) return
    console.log('map container:', container); // ✅ 확인

    const map = new window.kakao.maps.Map(container, {
      center: new window.kakao.maps.LatLng(35.413, 128.123),
      level: 4
    })
    mapRef.current = map

    filteredStores.forEach(store => {
      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(store.lat, store.lng),
        title: store.name
      })

      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedStore(store)
      })
    })

    // 첫 가게 자동 focus
    if (filteredStores.length > 0) {
      const target = filteredStores[0]
      map.setCenter(new window.kakao.maps.LatLng(target.lat, target.lng))
      map.setLevel(3)
    }
  }, [showMap, filteredStores])


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const searchBar = document.querySelector('.map-gallery-searchbar');
      const mapArea = document.getElementById('map');
      const mapContainer = document.querySelector('.map-gallery-map-container'); // ✅ 추가!

      const clickedTarget = e.target as Node;

      if (
        searchBar &&
        !searchBar.contains(clickedTarget) &&
        mapArea &&
        !mapArea.contains(clickedTarget) &&
        mapContainer &&
        !mapContainer.contains(clickedTarget) // ✅ 여기도 포함시켜!
      ) {
        setShowMap(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);





  return (
    <div className="map-gallery-wrapper">
      <div className="map-gallery-inner">
        <div className="map-gallery-swiper-container">
          <Swiper
            className="map-gallery-swiper"
            modules={[Navigation, Pagination, Autoplay]}
            navigation = {true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2000 }}
            loop
          >
            {['대가1호점', '미로식육식당', '태영식육식당'].map((name, i) => (
              <SwiperSlide key={i}>
                <img
                  src={`/img/landing/${name}_1.jpg`}
                  alt={name}
                  className="map-gallery-slide-img"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="map-gallery-searchbar">
            <button
              className="search-icon-button"
              onClick={() => {
                if (searchQuery.trim() === '') {
                  setFilteredStores(storeData)
                  setSelectedStore(null)
                } else {
                  const results = storeData.filter(store =>
                    store.name.includes(searchQuery)
                  )
                  setFilteredStores(results)
                  setSelectedStore(results[0] ?? null)
                }
              }}
            >
              <img src="/img/logo/search.svg" alt="검색 아이콘" className="search-icon-img" />
            </button>
            <input
              type="text"
              value={searchQuery}
              placeholder="내가 찾는 식당을 검색해보세요."
              onFocus={() => setShowMap(true)}
              onChange={(e) => {
                const keyword = e.target.value
                setSearchQuery(keyword)

                if (keyword.trim() === '') {
                  setFilteredStores(storeData)
                  setSelectedStore(null)
                } else {
                  const results = storeData.filter(store =>
                    store.name.includes(keyword)
                  )
                  setFilteredStores(results)
                  setSelectedStore(results[0] ?? null)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const results = storeData.filter(store =>
                    store.name.includes(searchQuery)
                  )
                  setFilteredStores(results)
                  setSelectedStore(results[0] ?? null)
                }
              }}
            />
          </div>


        </div>

        {/* 지도 */}
        {showMap && (
          <div className="map-gallery-map-container">

            {/* ✅ 지도 위에 겹쳐진 정보 카드 */}
            {selectedStore && (
              <div className="map-gallery-info-card">

                {/* ⬇️ 가게명 + 별점 + 메뉴링크 한 줄 정렬 */}
                <div className="info-header">
                  <h3 className="store-name">
                    {selectedStore.name}
                    <span className="rating">★★★★★</span>
                  </h3>

                  <div className="menu-links">
                    <a href="#" className="link">Review</a>
                    <span className="divider">|</span>
                    <a href="#" className="link">메뉴보기</a>
                  </div>
                </div>

                <p className="store-detail">
                  <span className="label">주소 :</span> {selectedStore.address} T. <b>{selectedStore.phone}</b>
                </p>

                <p className="store-detail">
                  <span className="label">영업시간 :</span> {selectedStore.hours.split('/')[0]}
                  {selectedStore.point && (
                    <span className="point"> ※ {selectedStore.point}</span>
                  )}
                </p>

                <p className="store-detail">
                  <span className="label">휴무 :</span> {selectedStore.hours.split('/')[1].replace('휴무', '')}
                </p>

                <a
                  href={`https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  📍 길찾기
                </a>
              </div>
            )}

            {/* ✅ 실제 지도 div */}
            <div id="map" />



          </div>
        )}


        {/* 배경 패턴 */}
      </div>
      <div className="map-gallery-pattern" />

      <div className="map-gallery-bottom" />


    </div>

  );
}
