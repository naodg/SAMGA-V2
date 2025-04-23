import { List } from "@chakra-ui/react"

export interface Store {
    name: string
    lat: number
    lng: number
    address: string
    phone: string
    hours: string
    point?: string
    options: string[]
    image: string
    description:string
  }







  export const storeData: Store[] = [
    {
      name: '대가1호점',
      lat: 35.411016,
      lng: 128.124549,
      address: '경남 합천군 삼가면 일부3길 8',
      phone: '055-931-0688',
      hours: '매일 11:00 - 18:00 / 매주 월요일 휴무',
      point: '고기 품절 시 조기 마감',
      options: ['babySeat', 'reservation', 'groupSeat'],
      image: '../../samga/store/대가1호점_디테일_1.png',
      description :'분위기 맛집이라 부르지만,\n 고기의 풍미는 분위기를 넘어선다.'
    },
    {
      name: '대가식육식당',
      lat: 35.413238,
      lng: 128.122724,
      address: '경남 합천군 삼가면 삼가중앙길 24-7',
      phone: '055-932-8249',
      hours: '매일 11:00 - 19:30 / 매주 월요일 휴무',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/대가식육식당_디테일_1.png',
      description:'좋은 고기를 다루는 건 \n기술이 아니라 신념이다.'
    },
    {
      name: '대가한우',
      lat: 35.413032,
      lng: 128.125073,
      address: '경남 합천군 삼가면 삼가로 353',
      phone: '055-932-1106',
      hours: '매일 10:30 - 19:30 / 매주 월요일 휴무',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/대가한우_디테일_1.png',
      description: '맛있는 고기에는 늘 이유가 있다.\n그 이유를 고집한다.'
    },
    {
      name: '대산식육식당',
      lat: 35.413304,
      lng: 128.123713,
      address: '경남 합천군 삼가1로 104',
      phone: '055-932-0289',
      hours: '매일 10:30 - 19:30 / 매주 월요일 휴무',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/대산식육식당_디테일_1.png',
      description:'엄마 손맛에\n 고기의 자부심을 더하다.'
    },
    {
      name: '대웅식육식당',
      lat: 35.412476,
      lng: 128.124175,
      address: '경남 합천군 삼가면 345-1',
      phone: '055-933-5566',
      hours: '매일 11:00 - 18:00 / 매주 월요일 휴무',
      point: '고기 품절 시 조기 마감',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/대웅식육식당_1.JPG',
      description:'땅에서 키운 정성\n 접시에 담긴 진심'
    },
    {
      name: '도원식육식당',
      lat: 35.4145,
      lng: 128.1234,
      address: '경남 합천군 삼가중앙길 40',
      phone: '055-932-9595',
      hours: '매일 10:30 - 19:30 / 유동적 휴일 운영',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/도원식육식당_1.JPG',
      description:'손님평점보다 더 정확한 건,\n 다시 찾는 발걸음. '
    },
    {
      name: '미로식육식당',
      lat: 35.412652,
      lng: 128.123201,
      address: '경남 합천군 삼가면 일부5길 6-5 1층',
      phone: '055-933-7744',
      hours: '매일 10:00 - 19:30 / 유동적 휴일 운영',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/대가1호점_1.jpg',
      description:'미로 속,\n 오직 맛으로 찾는 곳.'
    },
    {
      name: '불난가 한우',
      lat: 35.414209,
      lng: 128.120978,
      address: '경남 합천군 삼가면 삼가중앙1길 38',
      phone: '055-932-4623',
      hours: '매일 10:30 - 19:30 / 매주 월요일 휴무',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/대가1호점_1.jpg',
      description:'소개해 준 친구에게 고마운 집,\n 불이 붙을 만한 이유가 있다.'
    },
    {
      name: '삼가명품한우',
      lat: 35.412749,
      lng: 128.119125,
      address: '경남 합천군 삼가면 서부로 39',
      phone: '055-931-5004',
      hours: '매일 11:00 - 20:00 / 매주 수요일 휴무',
      point: '15:00 -  17:00 브레이크 타임',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/대가1호점_1.jpg',
      description:'최고가 아니면 판매하지 않습니다.'
    },
    {
      name: '상구한우',
      lat: 35.413601,
      lng: 128.122624,
      address: '경남 합천군 삼가면 삼가중앙길 26 1층',
      phone: '055-933-3969',
      hours: '매일 10:00 - 19:00 / 매주 화요일 휴무, 삼가 장날은 수요일 휴무',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/대가1호점_1.jpg',
      description:'일상 속 고깃집,\n 그러나 결코 평범하지 않은 맛.'
    },
    {
      name: '태영상차림식당',
      lat: 35.413468,
      lng: 128.123151,
      address: '경남 합천군 삼가면 일부5길 11',
      phone: '0507-1384-9399',
      hours: '매일 10:30 - 19:30 / 매주 월요일 휴무',
      options: ['babySeat', 'reservation'],
      image: '../../samga/store/대가1호점_1.jpg',
      description:'깔끔한 공간, 신선한 고기,\n젊은 입맛 사로잡다\n 취향이 깃든 한점'
    }
  ]