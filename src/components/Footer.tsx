export default function Footer() {
    return (
      <footer style={{
        width: '100%',
        background: '#f9f9f9',
        borderTop: '1px solid #ddd',
        padding: '40px 20px',
        fontSize: '13px',
        color: '#555'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '40px'
        }}>
  
          {/* Company Info */}
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Company Info</h4>
            <p>햇살안의 &nbsp;&nbsp;&nbsp; 대표 : 함양군 도시재생지원센터 &nbsp;&nbsp;&nbsp; 사업자 등록번호 : </p>
            <p>통신판매업신고번호</p>
            <p>주소 : 50011 경남 함양군 안의면 약초시장길 27 함양토종약초시장 함양군 도시재생지원센터</p>
            <p>팩스 : &nbsp;&nbsp;&nbsp; 이메일 : &nbsp;&nbsp;&nbsp; 개인정보보호책임자 : 이경진(naon-design@hanmail.net)</p>
            <p style={{ marginTop: '12px' }}>Copyright © 햇살안의. All rights reserved. &nbsp;&nbsp; 호스팅 by Cafe24 &nbsp;&nbsp; | &nbsp;&nbsp; 디자인 by KDESIGN</p>
          </div>
  
          {/* Customer Service */}
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Customer Service</h4>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#222' }}>055-963-5658</p>
          </div>
  
          {/* Links and SNS */}
          <div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '12px' }}>
              <li><a href="#" style={{ color: '#333', textDecoration: 'none' }}>회사소개</a></li>
              <li><a href="#" style={{ color: '#333', textDecoration: 'none' }}>이용약관</a></li>
              <li><a href="#" style={{ color: '#333', textDecoration: 'none', fontWeight: 'bold' }}>개인정보처리방침</a></li>
              <li><a href="#" style={{ color: '#333', textDecoration: 'none' }}>이용안내</a></li>
            </ul>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ border: '1px solid #ccc', borderRadius: '50%', width: '32px', height: '32px' }}>f</button>
              <button style={{ border: '1px solid #ccc', borderRadius: '50%', width: '32px', height: '32px' }}>i</button>
              <button style={{ border: '1px solid #ccc', borderRadius: '50%', width: '32px', height: '32px' }}>k</button>
            </div>
          </div>
  
        </div>
      </footer>
    )
  }