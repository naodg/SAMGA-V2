import './Footer.css';


export default function Footer() {
  return (

    <footer className="custom-footer">
      <div className="footer-inner">


        <div className="footer-column left">
          <img src="/img/logo/logo.svg" alt="우리마을삼가 로고" className="footer-logo" />
          <p>
            대표 : 합천군 도시재생지원 센터<br />
            사업자 등록번호 : -<br />
            주소 : 50223 경상남도 합천군 삼가면 삼가1로 100<br />
            팩스 : -<br />
            이메일 : 000@gmail.com<br />
          </p>
          <p className="copyright">
            Copyright © 우리마을삼가. All rights reserved.<br />
            호스팅 by Cafe24 | 디자인 by NAON
          </p>
        </div>


        <div className="footer-column middle">
          <h4>가게 리스트</h4>
          <ul className="store-list">
            <li>대가1호점</li>
            <li>대가식육식당</li>
            <li>대가한우</li>
            <li>대산식육식당</li>
            <li>대웅식육식당</li>
            <li>도원식육식당당</li>
            <li>미로식육식당당</li>
            <li>불난가한우우</li>
            <li>삼가명품한우우</li>
            <li>상구한우</li>
            <li>태영상차림식당</li>
          </ul>
        </div>

        <div className="footer-column middle">
          <h4>주변관광지</h4>

          <ul className="tour-list">
            <li><a href="https://blog.naver.com/hc-urc/222571944010" target="_blank" rel="noopener noreferrer">삼가특화거리-소화잘되는 길</a></li>
            <li><a href="https://www.hc.go.kr/09418/09425/09833.web" target="_blank" rel="noopener noreferrer">황매산 군립공원 공식사이트 </a></li>
            <li><a href="https://www.youtube.com/watch?v=DjprccTSapc" target="_blank" rel="noopener noreferrer">정양늪 공식사이트</a></li>
            <li><a href="https://www.youtube.com/watch?v=ZLch32VzUb0" target="_blank" rel="noopener noreferrer">삼가시장</a></li>
            <li><a href="https://hcmoviethemepark.com/" target="_blank" rel="noopener noreferrer">합천영상테마크</a></li>
          </ul>


        </div>

        <div className="footer-column right">
          <h4>이용 안내</h4>
          <ul className="footer-links">
            <li><a href="#">회사소개</a></li>
            <li><a href="#">이용약관</a></li>
            <li><a href="#">개인정보처리방침</a></li>
            <li><a href="#">이용안내</a></li>
          </ul>
          <div className="footer-sns">
            <a href="#">f</a>
            <a href="#">i</a>
            <a href="#">k</a>
          </div>
        </div>

      </div>
    </footer>

  )
}