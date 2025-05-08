
type StyleText = {
    text: string
    className: string // 이걸로 개별 스타일 지정
  }
  
  export const storeDetailAssets: Record<string, StyleText[]> = {
    '대가1호점': [
      {
        text: '‘대가 1호점’은',
        className: 'deaga1-1',
      },
      {
        text: '질 좋은 고기를 잘 샀을때\n손님을 모시고,\n그때 내어드려라',
        className: 'deaga1-2',
      },
      {
        text: '유러피안 정원\n고요한 숲 속의\n분위기 속 카페\n플로리안',
        className: 'deaga1-3',
      },
    ],
    '도원식육식당': [
      {
        text: '‘도원 식육식당’은',
        className: 'dowon1',
      },
      {
        text: '고기의 본질은 결국\n‘고기’\n그 자체입니다.',
        className: 'dowon2',
      },
      {
        text: '우리집 식탁에서\n만나 볼 수 있는 삼가 한우',
        className: 'dowon3',
      },
    ],
    // 다른 가게도 동일하게 정의
  }
  