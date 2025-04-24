import React from 'react'
import { useNavigate } from 'react-router-dom'
import { storeData, Store } from '../data/storeData'



export default function StoreList() {
  const isMobile = window.innerWidth <= 768
  const navigate = useNavigate()
  const handleStoreClick = (storeName: string) => {
    navigate(`/store/${encodeURIComponent(storeName)}`)
  }


  return (
    <div style={{ margin: '100px 0', fontFamily: 'sans-serif' }}>
      {/* 홍보 영상 영역 */}
      <div style={{ background: '#637472', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            gap: isMobile ? '30px' : '80px', // ✅ gap 조절
            maxWidth: '1490px',
            margin: '100px auto',
            padding: isMobile ? '40px 20px' : '40px 100px', // ✅ PC일 때 padding 좌우 증가시켜 내부를 가운데로 밀어줌
            textAlign: isMobile ? 'center' : 'left', // 👉 모바일일 때만 중앙 정렬
            alignItems: isMobile ? 'center' : 'center' // 👉 글씨 전체 가운데 배치
          }}
        >
          {/* 설명 텍스트 */}
          <div style={{ width: isMobile ? '100%' : '45%' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#fff' }}>
              삼가한우 프로모션
            </h2>
            <p style={{ fontSize: '26px', lineHeight: '1.6', color: '#ccc' }}>
              삼가에선 한우가 일상,<br />
              매일이 특별한 고기 한 끼
            </p>
          </div>

          {/* 동영상 */}
          <div style={{ width: isMobile ? '100%' : '45%' }}>
            <video
              src="/video/합천영상.mp4"
              width="100%"
              height="400px"
              muted
              loop
              playsInline
              controls
              style={{ borderRadius: '12px' }}
            />
          </div>
        </div>
      </div>



      {/* 매거진 스타일 가게 리스트 */}
      {/* <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '24px',
          margin: isMobile ? '0' : '100px 200px',
        }}
      >
        {storeData.map((store: typeof storeData[0], index: number) => (
          <div
            key={index}
            style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              transition: 'transform 0.3s',
              cursor: 'pointer'
            }}
            onClick={() => handleStoreClick(store.name)}
          >
            <img
              src={store.image}
              alt={store.name}
              style={{ width: '100%', height: '340px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{store.name}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{store.description}</p>
            </div>
          </div>
        ))}
      </div> */}



      {/* 매거진 스타일 가게 리스트 */}
      <div
        style={{
          position: 'relative',
          maxWidth: '1485px',
          margin: '200px auto',
          padding: '0 20px',
        }}
      >
        {/* ✅ 워터마크: position absolute로 격리 */}
        {/* {!isMobile && (
          <img
            src="/img/logo/logo2.jpg"
            alt="워터마크"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              opacity: 0.6,
              zIndex: 0,
              pointerEvents: 'none',
              objectFit: 'contain',
            }}
          />
        )} */}

        {/* ✅ 카드 리스트는 별도 wrapper로 묶고 zIndex 줌 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '48px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {storeData.map((store, index) => {
            const offsetY = [0, -60, 10][index % 3]
            return (
              <div
                key={index}
                style={{
                  background: 'transparent',
                  height: '500px',
                  position: 'relative',
                  cursor: 'pointer',
                  transform: isMobile? '': `translateY(${offsetY}px)`,
                  zIndex: 1,
                  borderRadius: '0px',
                  overflow: 'visible',
                  // border: '1px solid #333',
                  boxShadow: '0 5px 10px rgba(0,0,0,0.7)',
                }}
                onClick={() => handleStoreClick(store.name)}
              >
                {/* 이미지 */}
                <img
                  src={store.image}
                  alt={store.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: 0,
                  }}
                />

                {/* 이미지 위 텍스트 (store.name + description) */}
                {/* <div
                  style={{
                    position: 'absolute',
                    bottom: '60px', // ✅ 흰색 바 위로 살짝 띄워줌
                    left: 0,
                    width: '100%',
                    padding: '0 16px',
                    color: '#fff',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)', // ✅ 가독성 살리는 그림자
                    boxSizing: 'border-box',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', }}>{store.name}</h3>
                  <p style={{ margin: '6px 0 0', fontSize: '25px', whiteSpace: 'pre-line',lineHeight: '1.1'}}>{store.description}</p>
                </div> */}

                {/* 하단 흰색 배경 위 텍스트 (추가 설명) */}
                <div
                  style={{
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
                  }}
                >
                  {/* 가운데 영역 */}
                  <div
                    style={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '100' }}>{store.name}</h3>
                    <p
                      style={{
                        margin: '6px 0 0',
                        fontSize: '28px',
                        whiteSpace: 'pre-line',
                        lineHeight: '1.1',
                        fontWeight: 'bold',
                      }}
                    >
                      {store.description}
                    </p>
                  </div>

                  {/* 아래 고정 설명 */}
                  <p
                    style={{
                      fontSize: '13px',
                      marginTop: '12px',
                      marginBottom: '10px',
                      opacity: 0.85,
                    }}
                  >
                    한 줄 추가 설명이 여기에 들어갑니다.
                  </p>
                </div>

              </div>
            )
          })}
        </div>
      </div>




    </div >
  )
}
