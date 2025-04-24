// PC 버전은 그대로 유지하고, 모바일에서 가게 리스트 누락 및 지도 렌더링 문제 해결
// 모바일에서 지도 ID 중복 사용으로 생긴 문제 해결, 지도는 따로 렌더링되도록 분리

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeData, Store } from '../data/storeData';

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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showMap, setShowMap] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);
  const navigate = useNavigate();

  const mapId = isMobile ? 'mobileMap' : 'filterMap';

  useEffect(() => {
    const stores = activeFilters.length === 0
      ? storeData
      : storeData.filter(store =>
        activeFilters.every(filterKey => store.options?.includes(filterKey))
      );
    setFilteredStores(stores);
  }, [activeFilters]);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d65716a4db9e8a93aaff1dfc09ee36b8`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById(mapId);
        if (!container) return;
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

  const updateMarkers = (stores: Store[]) => {
    const map = mapRef.current;
    if (!map) return;
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

  const toggleFilter = (key: string) => {
    setActiveFilters(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    );
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {isMobile ? (
        <>
          <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', gap: '8px' }}>

            <button onClick={() => setShowMap(!showMap)} style={{ marginLeft: 'auto', padding: '10px 12px', borderRadius: '8px', background: '#222', color: '#fff' }}>
              🗺
            </button>

            {filters.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                style={{ padding: '2px 12px', borderRadius: '16px', backgroundColor: activeFilters.includes(key) ? '#C8102E' : '#eee', color: activeFilters.includes(key) ? '#fff' : '#333', border: 'none', whiteSpace: 'nowrap' }}
              >
                {label}
              </button>
            ))}

          </div>

          {showMap && (
            <div style={{ position: 'relative' }}>
              <div id="mobileMap" style={{ width: '100%', height: '50vh' }} />
              {selectedStore && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: '#fff', padding: '16px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', boxShadow: '0 -2px 8px rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{selectedStore.name}</h3>
                    <button onClick={() => setShowMap(false)}>✖</button>
                  </div>
                  <p>{selectedStore.address}</p>
                  <p>{selectedStore.phone}</p>
                  <a href={`https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`} target="_blank" rel="noopener noreferrer">📍 길찾기</a>
                </div>
              )}
            </div>
          )}

          <div style={{ padding: '10px' }}>
            {filteredStores.map(store => (
              <div key={store.name} onClick={() => navigate(`/store/${encodeURIComponent(store.name)}`)} style={{ display: 'flex', gap: '12px', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', padding: '12px', marginBottom: '12px', alignItems: 'center' }}>
                <img
                  src={store.image || '/img/default.jpg'}
                  alt={store.name}
                  style={{ width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div >
                  <h3 style={{ margin: 0 }}>{store.name}</h3>
                  <p style={{ margin: '4px 0' }}>{store.address}</p>
                  <p style={{ margin: '4px 0' }}>{store.phone}</p>
                  {/* {store.options?.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          marginTop: '6px'
                        }}>
                          {store.options.map(opt => (
                            <span key={opt} style={{
                              background: '#f5f5f5',
                              borderRadius: '20px',
                              padding: '4px 10px',
                              fontSize: '12px',
                              color: '#555'
                            }}>
                              #{opt}
                            </span>
                          ))}
                        </div>
                      )} */}
                </div>
              </div>
            ))}


            {selectedStore && (
              <div style={{
                position: 'absolute',
                right: '50px',
                bottom: '120px',
                width: '260px',
                background: '#fff',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                zIndex: 1000
              }}>
                <button onClick={() => { setShowMap(false); setSelectedStore(null); }}  style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>
                <h3 style={{ margin: 0 }}>{selectedStore.name}</h3>
                <p style={{ fontSize: '13px', margin: '4px 0' }}>{selectedStore.address}</p>
                <p style={{ fontSize: '13px', margin: '4px 0' }}>{selectedStore.phone}</p>
                <a
                  href={`https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13px',
                    color: '#0077cc',
                    textDecoration: 'underline',
                    display: 'inline-block',
                    marginTop: '10px'
                  }}
                >
                  📍 길찾기
                </a>
              </div>
            )}


          </div>
        </>
      ) : (
        <div style={{ margin: '0 200px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', height: '100vh', }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px 0', justifyContent: 'center', margin: '10px' }}>
              {filters.map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: activeFilters.includes(key) ? '#C8102E' : '#eee',
                    color: activeFilters.includes(key) ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100%' }}>
              <div style={{ flex: 1, maxWidth: '60%', overflowY: 'auto', padding: '20px', boxSizing: 'border-box' }}>
                {filteredStores.map(store => (
                  <div key={store.name} style={{
                    display: 'flex',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    padding: '16px',
                    gap: '16px',
                    marginBottom: '16px',
                    alignItems: 'flex-start',
                    cursor: 'pointer'
                  }} onClick={() => navigate(`/store/${encodeURIComponent(store.name)}`)}>
                    <img
                      src={store.image || '/img/default.jpg'}
                      alt={store.name}
                      style={{
                        width: '230px',
                        height: '180px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{store.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#ffc107', fontSize: '16px', marginRight: '6px' }}>★ ★ ★ ★ ☆</span>
                        <span style={{ fontSize: '14px', color: '#666' }}>(123 리뷰)</span>
                      </div>
                      <p style={{ fontSize: '14px', margin: '2px 0' }}><strong>📍</strong> {store.address}</p>
                      <p style={{ fontSize: '14px', margin: '2px 0' }}><strong>📞</strong> {store.phone}</p>
                      {store.options?.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          marginTop: '6px'
                        }}>
                          {store.options.map(opt => (
                            <span key={opt} style={{
                              background: '#f5f5f5',
                              borderRadius: '20px',
                              padding: '4px 10px',
                              fontSize: '12px',
                              color: '#555'
                            }}>
                              #{opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ width: '40%', height: '100%', position: 'sticky', top: 0, flex: 0.9 }}>
                <div id="filterMap" style={{ width: '100%', height: '100%', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }} />
                {selectedStore && (
                  <div style={{
                    position: 'absolute',
                    right: '50px',
                    bottom: '120px',
                    width: '260px',
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                    zIndex: 1000
                  }}>
                    <h3 style={{ margin: 0 }}>{selectedStore.name}</h3>
                    <p style={{ fontSize: '13px', margin: '4px 0' }}>{selectedStore.address}</p>
                    <p style={{ fontSize: '13px', margin: '4px 0' }}>{selectedStore.phone}</p>
                    <a
                      href={`https://map.kakao.com/link/to/${selectedStore.name},${selectedStore.lat},${selectedStore.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '13px',
                        color: '#0077cc',
                        textDecoration: 'underline',
                        display: 'inline-block',
                        marginTop: '10px'
                      }}
                    >
                      📍 길찾기
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
