import './Footer.css';
import { useNavigate } from "react-router-dom"
import { storeData } from "../data/storeData"

export default function Footer() {

  const navigate = useNavigate()

  const handleClick = (storeIndex: number) => {
    navigate(`/admin/store${storeIndex + 1}`) // store1, store2...
  }


  return (
    <footer className="custom-footer">
      <div className="footer-inner">

        {/* 1. 로고 + 기본 정보 */}
        <div className="footer-column left">
          <img src="/img/logo/logo.svg" alt="우리마을삼가 로고" className="footer-logo" />
          <p>
            대표 : 합천군 도시재생지원 센터<br />
            사업자 등록번호 : -<br />
            주소 : 50223 경상남도 합천군 삼가면 삼가1로 100<br />
            팩스 : -<br />
            이메일 : 000@gmail.com<br />
          </p>

          <ul className="footer-links">
            <li><a>회사소개</a></li>
            <li><a>이용약관</a></li>
            <li><a>개인정보처리방침</a></li>
            <li><a>이용안내</a></li>
          </ul>
          <div className="footer-sns">
            <a>f</a>
            <a>i</a>
            <a>k</a>
          </div>

          <p className="copyright">
            Copyright © 우리마을삼가. All rights reserved.<br />
            호스팅 by Cafe24 | 디자인 by NAON
          </p>

        </div>




        {/* 2. 가게 리스트 */}
        <div className="footer-column store">
          <h4>가게 리스트</h4>
          <ul className="store-list">
            <li>대가1호점</li>
            <li>대가식육식당</li>
            <li>대가한우</li>
            <li>대산식육식당</li>
            <li>대웅식육식당</li>
            <li>도원식육식당</li>
            <li>미로식육식당</li>
            <li>불난가한우</li>
            <li>삼가명품한우</li>
            <li>상구한우</li>
            <li>태영한우</li>
          </ul>
        </div>

        {/* 3. 주변 관광지 */}
        <div className="footer-column tourism">
          <h4>주변관광지</h4>
          <ul className="tour-list">
            <li><a href="https://blog.naver.com/hc-urc/222571944010" target="_blank" rel="noopener noreferrer">삼가특화거리</a></li>
            <li><a href="https://www.hc.go.kr/09418/09425/09833.web" target="_blank" rel="noopener noreferrer">황매산</a></li>
            <li><a href="https://www.youtube.com/watch?v=DjprccTSapc" target="_blank" rel="noopener noreferrer">정양늪</a></li>
            <li><a href="https://www.youtube.com/watch?v=ZLch32VzUb0" target="_blank" rel="noopener noreferrer">삼가시장</a></li>
            <li><a href="https://hcmoviethemepark.com/" target="_blank" rel="noopener noreferrer">합천영상테마파크</a></li>
          </ul>
        </div>





        {/* 4. 가게 관리자 페이지 */}
        <div className="footer-column manager">
          <h4>가게 관리자 페이지</h4>
          <ul className="manager-list">
            {storeData.map((store, index) => (
              <li
                key={index}
                onClick={() => handleClick(index)}
                style={{ cursor: "pointer", marginBottom: "4px" }}
              >
                {store.name}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </footer>
  );
}
