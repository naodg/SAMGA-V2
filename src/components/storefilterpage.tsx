// PC 버전은 그대로 유지하고, 모바일에서 가게 리스트 누락 및 지도 렌더링 문제 해결
// 모바일에서 지도 ID 중복 사용으로 생긴 문제 해결, 지도는 따로 렌더링되도록 분리

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeData, Store } from '../data/storeData';

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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showMap, setShowMap] = useState(false);
  const isMobile = window.innerWidth <= 1200;
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);
  const navigate = useNavigate();

  const [showMore, setShowMore] = useState(false);

  const mapId = isMobile ? 'mobileMap' : 'filterMap';

  const [paddingSize, setPaddingSize] = useState('120px');

  const [openOptions, setOpenOptions] = useState<{ [storeName: string]: boolean }>({});

  // ✅ 먼저 상태 추가
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    const updatePadding = () => {
      const width = window.innerWidth;
      if (width <= 1600) {
        setPaddingSize('0px'); // 태블릿: 양쪽 40px
      } else {
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
      // ✅ 클릭 이벤트를 등록할 때 함수로 selectedStore를 직접 체크하게 만든다
      contentDiv.addEventListener('click', () => {
        setSelectedStore(prevSelected => {
          if (prevSelected?.name === store.name) {
            return null; // 같으면 닫기
          } else {
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

  const toggleFilter = (key: string) => {
    setActiveFilters(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    );
  };

  return (
    <div>
      {isMobile ? (
        <>
          {/* 모바일 코드 */}
          {/* ✅ 1. 검색바 (최상단) */}
          <div style={{
            width: '100%',
            padding: '20px 10px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{
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
            }}>
              {/* 검색 버튼 */}
              <button
                onClick={() => {
                  if (searchQuery.trim() === '') {
                    setFilteredStores(storeData);
                    setSelectedStore(null);
                  } else {
                    const results = storeData.filter(store =>
                      store.name.includes(searchQuery)
                    );
                    setFilteredStores(results);
                    setSelectedStore(results[0] ?? null);
                  }
                }}
                style={{
                  background: '#AD5457',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  height: '40px',
                  width: '40px'
                }}
              >
                <img
                  src="/img/logo/search.svg"
                  alt="검색 아이콘"
                  style={{ width: '20px', height: '20px' }}
                />
              </button>

              {/* 검색 input */}
              <input
                type="text"
                value={searchQuery}
                placeholder="내가 찾는 식당을 검색해보세요."
                onFocus={() => setShowMap(true)}
                onChange={(e) => {
                  const keyword = e.target.value;
                  setSearchQuery(keyword);

                  if (keyword.trim() === '') {
                    setFilteredStores(storeData);
                    setSelectedStore(null);
                  } else {
                    const results = storeData.filter(store =>
                      store.name.includes(keyword)
                    );
                    setFilteredStores(results);
                    setSelectedStore(results[0] ?? null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const results = storeData.filter(store =>
                      store.name.includes(searchQuery)
                    );
                    setFilteredStores(results);
                    setSelectedStore(results[0] ?? null);
                  }
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          {/* ✅ 2. 필터 버튼 */}
          <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 10px', gap: '8px' }}>
            <button onClick={() => setShowMap(!showMap)} style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: '8px', background: '#AD5457', color: '#fff' }}>
              <img src='/img/icon/map.svg' width={'15px'} />
            </button>

            {filters.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                style={{ padding: '2px 12px', borderRadius: '16px', backgroundColor: activeFilters.includes(key) ? '#C8102E' : '#eee', color: activeFilters.includes(key) ? '#fff' : '#333', border: 'none', whiteSpace: 'nowrap' }}
              >
                {label} {activeFilters.includes(key) && <span style={{ marginLeft: '6px' }}>×</span>}
              </button>
            ))}
          </div>

          {/* ✅ 3. 지도 표시 */}
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

          {/* ✅ 4. 가게 리스트 */}
          <div style={{ padding: '10px' }}>
            {filteredStores.map(store => (
              <div
                key={store.name}
                onClick={() => navigate(`/store/${encodeURIComponent(store.name)}`)}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  padding: '12px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                }}
              >
                {/* 사진 + 텍스트 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <img
                    src={store.image || '/img/default.jpg'}
                    alt={store.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ flex: 1, margin: '0 0 4px 0' }}>
                      <h3 style={{ fontSize: '16px', marginBottom: '2px' }}>{store.name}</h3>
                        <span style={{ color: '#AD5457', fontSize: '16px', marginRight: '6px' }}>★ ★ ★ ★ ☆</span>
                        <span style={{ fontSize: '14px', color: '#666' }}>(123 리뷰)</span>
                      </div>

                      <p style={{ margin: '4px 0', fontSize: '13px' }}>{store.address}</p>
                      <p style={{ margin: '4px 0', fontSize: '13px' }}>{store.phone}</p>
                    </div>
                  </div>

                  {/* 옵션 */}
                  {store.options?.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '10px',
                      paddingLeft: '0px',
                    }}>
                      {(openOptions[store.name] ? store.options : store.options.slice(0, 3)).map(opt => (
                        <span
                          key={opt}
                          style={{
                            background: '#f5f5f5',
                            borderRadius: '20px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            color: '#555',
                          }}
                        >
                          #{opt}
                        </span>
                      ))}

                      {/* 더보기/간략히 버튼 */}
                      {store.options.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenOptions(prev => ({
                              ...prev,
                              [store.name]: !prev[store.name],
                            }));
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#0077cc',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginTop: '6px',
                          }}
                        >
                          {openOptions[store.name] ? '간략히 ▲' : '더보기 ▼'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
            ))}

                {/* 팝업 카드 */}
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
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{ margin: 0 }}>{selectedStore.name}</h3>
                      <button
                        onClick={() => setSelectedStore(null)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '18px',
                          cursor: 'pointer',
                          lineHeight: '1',
                        }}
                      >
                        ✖
                      </button>
                    </div>
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
                      길찾기
                    </a>
                  </div>
                )}
              </div>
        </>
          ) : (


          // PC코드 시작
          <div style={{ margin: '0 200px' }}>

            <div style={{
              width: '100%',
              padding: '20px 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

              <div style={{
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
              }}>
                {/* 검색 아이콘 버튼 */}
                <button
                  onClick={() => {
                    if (searchQuery.trim() === '') {
                      setFilteredStores(storeData);
                      setSelectedStore(null);
                    } else {
                      const results = storeData.filter(store =>
                        store.name.includes(searchQuery)
                      );
                      setFilteredStores(results);
                      setSelectedStore(results[0] ?? null);
                    }
                  }}
                  style={{
                    background: '#AD5457',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    height: '40px',
                    width: '40px'
                  }}
                >
                  <img
                    src="/img/logo/search.svg"
                    alt="검색 아이콘"
                    style={{ width: '20px', height: '20px' }}
                  />
                </button>

                {/* 검색 입력창 */}
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="내가 찾는 식당을 검색해보세요."
                  onFocus={() => setShowMap(true)}
                  onChange={(e) => {
                    const keyword = e.target.value;
                    setSearchQuery(keyword);

                    if (keyword.trim() === '') {
                      setFilteredStores(storeData);
                      setSelectedStore(null);
                    } else {
                      const results = storeData.filter(store =>
                        store.name.includes(keyword)
                      );
                      setFilteredStores(results);
                      setSelectedStore(results[0] ?? null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const results = storeData.filter(store =>
                        store.name.includes(searchQuery)
                      );
                      setFilteredStores(results);
                      setSelectedStore(results[0] ?? null);
                    }
                  }}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    background: 'transparent',
                  }}
                />
              </div>

            </div>

            <hr style={{ borderTop: '1px solid #AD5457', maxWidth: '1230px', margin: '20px auto 10px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', height: '100vh', }}>

              <div style={{
                display: 'flex',
                overflowX: 'auto',    // ✅ 가로 스크롤 가능
                whiteSpace: 'nowrap', // ✅ 줄바꿈 없이 한줄
                gap: '8px',
                padding: '15px 96px 15px',
                justifyContent: 'center'
              }}>
                {filters.map(({ label, key }) => (
                  <button
                    key={key}
                    onClick={() => toggleFilter(key)}
                    style={{
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
                    }}
                  >
                    {label} {activeFilters.includes(key) && <span style={{ fontWeight: 'bold', fontSize: '14px' }}>×</span>}
                  </button>
                ))}
              </div>



              <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100%', padding: `0 ${paddingSize}`, }}>
                <div style={{ flex: 1, maxWidth: '80%', overflowY: 'auto', padding: '20px', boxSizing: 'border-box' }}>
                  {filteredStores.map(store => (
                    <div key={store.name} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      padding: '16px',
                      marginBottom: '16px',
                    }}>

                      {/* ✅ 상단: 이미지 + 텍스트 한 줄로 */}
                      <div
                        onClick={() => navigate(`/store/${encodeURIComponent(store.name)}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          gap: '16px',
                        }}
                      >
                        <img
                          src={store.image || '/img/default.jpg'}
                          alt={store.name}
                          style={{
                            width: '230px',
                            height: '180px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{store.name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ color: '#AD5754', fontSize: '16px', marginRight: '6px' }}>★ ★ ★ ★ ☆</span>
                            <span style={{ fontSize: '14px', color: '#666' }}>(123 리뷰)</span>
                          </div>
                          <p style={{ fontSize: '14px', margin: '2px 0' }}><strong>주소:</strong> {store.address}</p>
                          <p style={{ fontSize: '14px', margin: '2px 0' }}><strong>T.</strong> {store.phone}</p>
                        </div>
                      </div>

                      {/* ✅ 하단: 옵션들 */}
                      {store.options?.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          marginTop: '12px'
                        }}>
                          {(openOptions[store.name] ? store.options : store.options.slice(0, 5)).map(opt => (
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

                          {/* 더보기/접기 버튼 */}
                          {store.options.length > 5 && (
                            <button
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#0077cc',
                                fontSize: '12px',
                                cursor: 'pointer',
                                marginTop: '6px'
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // 상세페이지 이동 방지
                                setOpenOptions(prev => ({
                                  ...prev,
                                  [store.name]: !prev[store.name] // 이 가게만 토글
                                }));
                              }}
                            >
                              {openOptions[store.name] ? '간략히 ▲' : '더보기 ▼'}
                            </button>
                          )}
                        </div>
                      )}
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
                      {/* ✅ 여기 추가 */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{ margin: 0 }}>{selectedStore.name}</h3>
                        <button
                          onClick={() => setSelectedStore(null)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer',
                            lineHeight: '1',
                          }}
                        >
                          ✖
                        </button>
                      </div>
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
                        길찾기
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
