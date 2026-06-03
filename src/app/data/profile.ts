export type RegionCode =
  | "seoul"
  | "gyeonggi"
  | "incheon"
  | "busan"
  | "daegu"
  | "daejeon"
  | "gwangju"
  | "ulsan"
  | "sejong"
  | "gangwon"
  | "chungbuk"
  | "chungnam"
  | "jeonbuk"
  | "jeonnam"
  | "gyeongbuk"
  | "gyeongnam"
  | "jeju";

export interface UserProfile {
  age: number;
  income: string;
  region: RegionCode;
  district?: string;
  university?: string;
  profileCompleted: boolean;
}

type ProfileOption = {
  value: string;
  label: string;
};

const DISTRICT_OPTIONS_BY_REGION: Record<RegionCode, ProfileOption[]> = {
  seoul: [
    { value: "seoul-jongno", label: "종로구" },
    { value: "seoul-jung", label: "중구" },
    { value: "seoul-yongsan", label: "용산구" },
    { value: "seoul-seongdong", label: "성동구" },
    { value: "seoul-gwangjin", label: "광진구" },
    { value: "seoul-dongdaemun", label: "동대문구" },
    { value: "seoul-jungnang", label: "중랑구" },
    { value: "seoul-seongbuk", label: "성북구" },
    { value: "seoul-gangbuk", label: "강북구" },
    { value: "seoul-dobong", label: "도봉구" },
    { value: "seoul-nowon", label: "노원구" },
    { value: "seoul-eunpyeong", label: "은평구" },
    { value: "seoul-seodaemun", label: "서대문구" },
    { value: "seoul-mapo", label: "마포구" },
    { value: "seoul-yangcheon", label: "양천구" },
    { value: "seoul-gangseo", label: "강서구" },
    { value: "seoul-guro", label: "구로구" },
    { value: "seoul-geumcheon", label: "금천구" },
    { value: "seoul-yeongdeungpo", label: "영등포구" },
    { value: "seoul-dongjak", label: "동작구" },
    { value: "seoul-gwanak", label: "관악구" },
    { value: "seoul-seocho", label: "서초구" },
    { value: "seoul-gangnam", label: "강남구" },
    { value: "seoul-songpa", label: "송파구" },
    { value: "seoul-gangdong", label: "강동구" },
  ],
  gyeonggi: [
    { value: "gyeonggi-suwon-jangan", label: "수원시 장안구" },
    { value: "gyeonggi-suwon-gwonseon", label: "수원시 권선구" },
    { value: "gyeonggi-suwon-paldal", label: "수원시 팔달구" },
    { value: "gyeonggi-suwon-yeongtong", label: "수원시 영통구" },
    { value: "gyeonggi-seongnam-sujeong", label: "성남시 수정구" },
    { value: "gyeonggi-seongnam-jungwon", label: "성남시 중원구" },
    { value: "gyeonggi-seongnam-bundang", label: "성남시 분당구" },
    { value: "gyeonggi-uijeongbu", label: "의정부시" },
    { value: "gyeonggi-anyang-manan", label: "안양시 만안구" },
    { value: "gyeonggi-anyang-dongan", label: "안양시 동안구" },
    { value: "gyeonggi-bucheon-wonmi", label: "부천시 원미구" },
    { value: "gyeonggi-bucheon-sosa", label: "부천시 소사구" },
    { value: "gyeonggi-bucheon-ojeong", label: "부천시 오정구" },
    { value: "gyeonggi-gwangmyeong", label: "광명시" },
    { value: "gyeonggi-pyeongtaek", label: "평택시" },
    { value: "gyeonggi-dongducheon", label: "동두천시" },
    { value: "gyeonggi-yongin-suji", label: "용인시 수지구" },
    { value: "gyeonggi-ansan-sangnok", label: "안산시 상록구" },
    { value: "gyeonggi-ansan-danwon", label: "안산시 단원구" },
    { value: "gyeonggi-goyang-deogyang", label: "고양시 덕양구" },
    { value: "gyeonggi-goyang-ilsandong", label: "고양시 일산동구" },
    { value: "gyeonggi-goyang-ilsanseo", label: "고양시 일산서구" },
    { value: "gyeonggi-gwacheon", label: "과천시" },
    { value: "gyeonggi-guri", label: "구리시" },
    { value: "gyeonggi-namyangju", label: "남양주시" },
    { value: "gyeonggi-osan", label: "오산시" },
    { value: "gyeonggi-siheung", label: "시흥시" },
    { value: "gyeonggi-gunpo", label: "군포시" },
    { value: "gyeonggi-uiwang", label: "의왕시" },
    { value: "gyeonggi-hanam", label: "하남시" },
    { value: "gyeonggi-yongin-cheoin", label: "용인시 처인구" },
    { value: "gyeonggi-yongin-giheung", label: "용인시 기흥구" },
    { value: "gyeonggi-paju", label: "파주시" },
    { value: "gyeonggi-icheon", label: "이천시" },
    { value: "gyeonggi-anseong", label: "안성시" },
    { value: "gyeonggi-gimpo", label: "김포시" },
    { value: "gyeonggi-hwaseong-dongtan", label: "화성시 동탄권" },
    { value: "gyeonggi-gwangju", label: "광주시" },
    { value: "gyeonggi-yangju", label: "양주시" },
    { value: "gyeonggi-pocheon", label: "포천시" },
    { value: "gyeonggi-yeoju", label: "여주시" },
    { value: "gyeonggi-yeoncheon", label: "연천군" },
    { value: "gyeonggi-gapyeong", label: "가평군" },
    { value: "gyeonggi-yangpyeong", label: "양평군" },
  ],
  incheon: [
    { value: "incheon-jung", label: "중구" },
    { value: "incheon-dong", label: "동구" },
    { value: "incheon-michuhol", label: "미추홀구" },
    { value: "incheon-yeonsu", label: "연수구" },
    { value: "incheon-namdong", label: "남동구" },
    { value: "incheon-bupyeong", label: "부평구" },
    { value: "incheon-gyeyang", label: "계양구" },
    { value: "incheon-seo", label: "서구" },
    { value: "incheon-ganghwa", label: "강화군" },
    { value: "incheon-ongjin", label: "옹진군" },
  ],
  busan: [
    { value: "busan-geumjeong", label: "금정구" },
    { value: "busan-nam", label: "남구" },
    { value: "busan-busanjin", label: "부산진구" },
    { value: "busan-sasang", label: "사상구" },
    { value: "busan-haeundae", label: "해운대구" },
    { value: "busan-jung", label: "중구" },
    { value: "busan-seo", label: "서구" },
    { value: "busan-dong", label: "동구" },
    { value: "busan-yeongdo", label: "영도구" },
    { value: "busan-dongnae", label: "동래구" },
    { value: "busan-buk", label: "북구" },
    { value: "busan-saha", label: "사하구" },
    { value: "busan-gangseo", label: "강서구" },
    { value: "busan-yeonje", label: "연제구" },
    { value: "busan-suyeong", label: "수영구" },
    { value: "busan-gijang", label: "기장군" },
  ],
  daegu: [
    { value: "daegu-jung", label: "중구" },
    { value: "daegu-dong", label: "동구" },
    { value: "daegu-seo", label: "서구" },
    { value: "daegu-buk", label: "북구" },
    { value: "daegu-nam", label: "남구" },
    { value: "daegu-dalseo", label: "달서구" },
    { value: "daegu-suseong", label: "수성구" },
    { value: "daegu-dalseong", label: "달성군" },
    { value: "daegu-gunwi", label: "군위군" },
  ],
  daejeon: [
    { value: "daejeon-yuseong", label: "유성구" },
    { value: "daejeon-jung", label: "중구" },
    { value: "daejeon-seo", label: "서구" },
    { value: "daejeon-dong", label: "동구" },
    { value: "daejeon-daedeok", label: "대덕구" },
  ],
  gwangju: [
    { value: "gwangju-dong", label: "동구" },
    { value: "gwangju-buk", label: "북구" },
    { value: "gwangju-seo", label: "서구" },
    { value: "gwangju-nam", label: "남구" },
    { value: "gwangju-gwangsan", label: "광산구" },
  ],
  ulsan: [
    { value: "ulsan-nam", label: "남구" },
    { value: "ulsan-jung", label: "중구" },
    { value: "ulsan-buk", label: "북구" },
    { value: "ulsan-dong", label: "동구" },
    { value: "ulsan-ulju", label: "울주군" },
  ],
  sejong: [
    { value: "sejong-jochiwon", label: "조치원읍" },
    { value: "sejong-jiphyeon", label: "집현동" },
    { value: "sejong-saerom", label: "새롬동" },
    { value: "sejong-dodam", label: "도담동" },
    { value: "sejong-boram", label: "보람동" },
    { value: "sejong-daepyeong", label: "대평동" },
  ],
  gangwon: [
    { value: "gangwon-chuncheon", label: "춘천시" },
    { value: "gangwon-wonju", label: "원주시" },
    { value: "gangwon-gangneung", label: "강릉시" },
    { value: "gangwon-donghae", label: "동해시" },
    { value: "gangwon-taebaek", label: "태백시" },
    { value: "gangwon-sokcho", label: "속초시" },
    { value: "gangwon-samcheok", label: "삼척시" },
    { value: "gangwon-hongcheon", label: "홍천군" },
    { value: "gangwon-hoengseong", label: "횡성군" },
    { value: "gangwon-yeongwol", label: "영월군" },
    { value: "gangwon-pyeongchang", label: "평창군" },
    { value: "gangwon-jeongseon", label: "정선군" },
    { value: "gangwon-cheorwon", label: "철원군" },
    { value: "gangwon-hwacheon", label: "화천군" },
    { value: "gangwon-yanggu", label: "양구군" },
    { value: "gangwon-inje", label: "인제군" },
    { value: "gangwon-goseong", label: "고성군" },
    { value: "gangwon-yangyang", label: "양양군" },
  ],
  chungbuk: [
    { value: "chungbuk-cheongju-seowon", label: "청주시 서원구" },
    { value: "chungbuk-cheongju-heungdeok", label: "청주시 흥덕구" },
    { value: "chungbuk-cheongju-sangdang", label: "청주시 상당구" },
    { value: "chungbuk-cheongju-cheongwon", label: "청주시 청원구" },
    { value: "chungbuk-chungju", label: "충주시" },
    { value: "chungbuk-jecheon", label: "제천시" },
    { value: "chungbuk-boeun", label: "보은군" },
    { value: "chungbuk-okcheon", label: "옥천군" },
    { value: "chungbuk-yeongdong", label: "영동군" },
    { value: "chungbuk-jeungpyeong", label: "증평군" },
    { value: "chungbuk-jincheon", label: "진천군" },
    { value: "chungbuk-goesan", label: "괴산군" },
    { value: "chungbuk-eumseong", label: "음성군" },
    { value: "chungbuk-danyang", label: "단양군" },
  ],
  chungnam: [
    { value: "chungnam-cheonan-dongnam", label: "천안시 동남구" },
    { value: "chungnam-cheonan-seobuk", label: "천안시 서북구" },
    { value: "chungnam-gongju", label: "공주시" },
    { value: "chungnam-boryeong", label: "보령시" },
    { value: "chungnam-asan", label: "아산시" },
    { value: "chungnam-seosan", label: "서산시" },
    { value: "chungnam-nonsan", label: "논산시" },
    { value: "chungnam-gyeryong", label: "계룡시" },
    { value: "chungnam-dangjin", label: "당진시" },
    { value: "chungnam-geumsan", label: "금산군" },
    { value: "chungnam-buyeo", label: "부여군" },
    { value: "chungnam-seocheon", label: "서천군" },
    { value: "chungnam-cheongyang", label: "청양군" },
    { value: "chungnam-hongseong", label: "홍성군" },
    { value: "chungnam-yesan", label: "예산군" },
    { value: "chungnam-taean", label: "태안군" },
  ],
  jeonbuk: [
    { value: "jeonbuk-jeonju-deokjin", label: "전주시 덕진구" },
    { value: "jeonbuk-jeonju-wansan", label: "전주시 완산구" },
    { value: "jeonbuk-gunsan", label: "군산시" },
    { value: "jeonbuk-iksan", label: "익산시" },
    { value: "jeonbuk-jeongeup", label: "정읍시" },
    { value: "jeonbuk-namwon", label: "남원시" },
    { value: "jeonbuk-gimje", label: "김제시" },
    { value: "jeonbuk-wanju", label: "완주군" },
    { value: "jeonbuk-jinan", label: "진안군" },
    { value: "jeonbuk-muju", label: "무주군" },
    { value: "jeonbuk-jangsu", label: "장수군" },
    { value: "jeonbuk-imsil", label: "임실군" },
    { value: "jeonbuk-sunchang", label: "순창군" },
    { value: "jeonbuk-gochang", label: "고창군" },
    { value: "jeonbuk-buan", label: "부안군" },
  ],
  jeonnam: [
    { value: "jeonnam-mokpo", label: "목포시" },
    { value: "jeonnam-suncheon", label: "순천시" },
    { value: "jeonnam-yeosu", label: "여수시" },
    { value: "jeonnam-naju", label: "나주시" },
    { value: "jeonnam-gwangyang", label: "광양시" },
    { value: "jeonnam-damyang", label: "담양군" },
    { value: "jeonnam-gokseong", label: "곡성군" },
    { value: "jeonnam-gurye", label: "구례군" },
    { value: "jeonnam-goheung", label: "고흥군" },
    { value: "jeonnam-boseong", label: "보성군" },
    { value: "jeonnam-hwasun", label: "화순군" },
    { value: "jeonnam-jangheung", label: "장흥군" },
    { value: "jeonnam-gangjin", label: "강진군" },
    { value: "jeonnam-haenam", label: "해남군" },
    { value: "jeonnam-yeongam", label: "영암군" },
    { value: "jeonnam-muan", label: "무안군" },
    { value: "jeonnam-hampyeong", label: "함평군" },
    { value: "jeonnam-yeonggwang", label: "영광군" },
    { value: "jeonnam-jangseong", label: "장성군" },
    { value: "jeonnam-wando", label: "완도군" },
    { value: "jeonnam-jindo", label: "진도군" },
    { value: "jeonnam-sinan", label: "신안군" },
  ],
  gyeongbuk: [
    { value: "gyeongbuk-pohang-nam", label: "포항시 남구" },
    { value: "gyeongbuk-pohang-buk", label: "포항시 북구" },
    { value: "gyeongbuk-gyeongju", label: "경주시" },
    { value: "gyeongbuk-gimcheon", label: "김천시" },
    { value: "gyeongbuk-andong", label: "안동시" },
    { value: "gyeongbuk-gumi", label: "구미시" },
    { value: "gyeongbuk-yeongju", label: "영주시" },
    { value: "gyeongbuk-yeongcheon", label: "영천시" },
    { value: "gyeongbuk-sangju", label: "상주시" },
    { value: "gyeongbuk-mungyeong", label: "문경시" },
    { value: "gyeongbuk-gyeongsan", label: "경산시" },
    { value: "gyeongbuk-uiseong", label: "의성군" },
    { value: "gyeongbuk-cheongsong", label: "청송군" },
    { value: "gyeongbuk-yeongyang", label: "영양군" },
    { value: "gyeongbuk-yeongdeok", label: "영덕군" },
    { value: "gyeongbuk-cheongdo", label: "청도군" },
    { value: "gyeongbuk-goryeong", label: "고령군" },
    { value: "gyeongbuk-seongju", label: "성주군" },
    { value: "gyeongbuk-chilgok", label: "칠곡군" },
    { value: "gyeongbuk-yecheon", label: "예천군" },
    { value: "gyeongbuk-bonghwa", label: "봉화군" },
    { value: "gyeongbuk-ulleung", label: "울릉군" },
  ],
  gyeongnam: [
    { value: "gyeongnam-changwon-uichang", label: "창원시 의창구" },
    { value: "gyeongnam-changwon-seongsan", label: "창원시 성산구" },
    { value: "gyeongnam-changwon-masanhappo", label: "창원시 마산합포구" },
    { value: "gyeongnam-changwon-masanhoewon", label: "창원시 마산회원구" },
    { value: "gyeongnam-changwon-jinhae", label: "창원시 진해구" },
    { value: "gyeongnam-jinju", label: "진주시" },
    { value: "gyeongnam-tongyeong", label: "통영시" },
    { value: "gyeongnam-sacheon", label: "사천시" },
    { value: "gyeongnam-gimhae", label: "김해시" },
    { value: "gyeongnam-miryang", label: "밀양시" },
    { value: "gyeongnam-geoje", label: "거제시" },
    { value: "gyeongnam-yangsan", label: "양산시" },
    { value: "gyeongnam-uiryeong", label: "의령군" },
    { value: "gyeongnam-haman", label: "함안군" },
    { value: "gyeongnam-changnyeong", label: "창녕군" },
    { value: "gyeongnam-goseong", label: "고성군" },
    { value: "gyeongnam-namhae", label: "남해군" },
    { value: "gyeongnam-hadong", label: "하동군" },
    { value: "gyeongnam-sancheong", label: "산청군" },
    { value: "gyeongnam-hamyang", label: "함양군" },
    { value: "gyeongnam-geochang", label: "거창군" },
    { value: "gyeongnam-hapcheon", label: "합천군" },
  ],
  jeju: [
    { value: "jeju-jeju", label: "제주시" },
    { value: "jeju-seogwipo", label: "서귀포시" },
  ],
};

const UNIVERSITY_OPTIONS_BY_DISTRICT: Record<string, ProfileOption[]> = {
  "seoul-jongno": [
    { value: "sungkyunkwan", label: "성균관대학교 인문사회과학캠퍼스" },
    { value: "sangmyung-seoul", label: "상명대학교 서울캠퍼스" },
  ],
  "seoul-jung": [
    { value: "dongguk", label: "동국대학교 서울캠퍼스" },
    { value: "soongeui", label: "숭의여자대학교" },
  ],
  "seoul-yongsan": [{ value: "sookmyung", label: "숙명여자대학교" }],
  "seoul-seongdong": [{ value: "hanyang", label: "한양대학교" }],
  "seoul-gwangjin": [
    { value: "konkuk", label: "건국대학교 서울캠퍼스" },
    { value: "sejong-univ", label: "세종대학교" },
  ],
  "seoul-mapo": [
    { value: "hongik", label: "홍익대학교 서울캠퍼스" },
    { value: "sogang", label: "서강대학교" },
    { value: "yonsei", label: "연세대학교" },
    { value: "ewha", label: "이화여자대학교" },
  ],
  "seoul-seodaemun": [
    { value: "yonsei", label: "연세대학교" },
    { value: "ewha", label: "이화여자대학교" },
    { value: "myongji-seoul", label: "명지대학교 인문캠퍼스" },
  ],
  "seoul-dongdaemun": [
    { value: "kyunghee", label: "경희대학교 서울캠퍼스" },
    { value: "korea", label: "고려대학교 서울캠퍼스" },
    { value: "hankuk", label: "한국외국어대학교 서울캠퍼스" },
    { value: "uos", label: "서울시립대학교" },
  ],
  "seoul-gangbuk": [
    { value: "duksung", label: "덕성여자대학교" },
    { value: "hanshin-seoul", label: "한신대학교 신학대학원 생활권" },
  ],
  "seoul-eunpyeong": [{ value: "seoul-christian", label: "서울기독대학교" }],
  "seoul-gwanak": [
    { value: "snu", label: "서울대학교" },
    { value: "soongsil", label: "숭실대학교" },
  ],
  "seoul-dongjak": [
    { value: "soongsil", label: "숭실대학교" },
    { value: "chungang", label: "중앙대학교 서울캠퍼스" },
    { value: "sungkyunkwan", label: "성균관대학교 인문사회과학캠퍼스" },
  ],
  "seoul-seongbuk": [
    { value: "kookmin", label: "국민대학교" },
    { value: "sungshin", label: "성신여자대학교" },
    { value: "korea", label: "고려대학교 서울캠퍼스" },
  ],
  "seoul-nowon": [
    { value: "snuet", label: "서울과학기술대학교" },
    { value: "kwangwoon", label: "광운대학교" },
    { value: "induk", label: "인덕대학교" },
  ],
  "seoul-gangseo": [{ value: "kangseo", label: "강서대학교" }],
  "seoul-guro": [
    { value: "dongyang-mirae", label: "동양미래대학교" },
    { value: "sungkonghoe", label: "성공회대학교" },
  ],
  "seoul-seocho": [
    { value: "catholic-seoul", label: "가톨릭대학교 성의교정" },
    { value: "seoul-edu", label: "서울교육대학교" },
  ],
  "seoul-songpa": [{ value: "knsu", label: "한국체육대학교" }],
  "gyeonggi-suwon-jangan": [
    { value: "sungkyunkwan-natural", label: "성균관대학교 자연과학캠퍼스" },
    { value: "dongnam-health", label: "동남보건대학교" },
  ],
  "gyeonggi-suwon-paldal": [{ value: "suwon-women", label: "수원여자대학교" }],
  "gyeonggi-suwon-yeongtong": [
    { value: "ajou", label: "아주대학교" },
    { value: "kyonggi-suwon", label: "경기대학교 수원캠퍼스" },
    { value: "suwon", label: "수원대학교" },
  ],
  "gyeonggi-seongnam-sujeong": [
    { value: "gachon-global", label: "가천대학교 글로벌캠퍼스" },
    { value: "eulji-seongnam", label: "을지대학교 성남캠퍼스" },
  ],
  "gyeonggi-seongnam-bundang": [
    { value: "gachon-global", label: "가천대학교 글로벌캠퍼스" },
    { value: "cha", label: "차의과학대학교" },
  ],
  "gyeonggi-yongin-suji": [
    { value: "dankook-jukjeon", label: "단국대학교 죽전캠퍼스" },
    { value: "kyonggi-suwon", label: "경기대학교 수원캠퍼스" },
  ],
  "gyeonggi-yongin-cheoin": [
    { value: "myongji-yongin", label: "명지대학교 자연캠퍼스" },
    { value: "yongin-univ", label: "용인대학교" },
  ],
  "gyeonggi-yongin-giheung": [
    { value: "kangnam", label: "강남대학교" },
    { value: "calvin", label: "칼빈대학교" },
  ],
  "gyeonggi-ansan-sangnok": [
    { value: "hanyang-erica", label: "한양대학교 ERICA캠퍼스" },
    { value: "seoul-arts", label: "서울예술대학교" },
  ],
  "gyeonggi-ansan-danwon": [{ value: "ansan-univ", label: "안산대학교 생활권" }],
  "gyeonggi-anyang-dongan": [
    { value: "anyang", label: "안양대학교" },
    { value: "sungkyul", label: "성결대학교" },
  ],
  "gyeonggi-anyang-manan": [
    { value: "anyang", label: "안양대학교" },
    { value: "daelim", label: "대림대학교" },
  ],
  "gyeonggi-goyang-deogyang": [{ value: "kau", label: "한국항공대학교" }],
  "gyeonggi-goyang-ilsandong": [{ value: "dongguk-bio", label: "동국대학교 바이오메디캠퍼스" }],
  "gyeonggi-hwaseong-dongtan": [
    { value: "hanshin", label: "한신대학교" },
    { value: "suwon", label: "수원대학교" },
  ],
  "gyeonggi-bucheon-wonmi": [
    { value: "bucheon", label: "부천대학교" },
    { value: "catholic", label: "가톨릭대학교 성심교정" },
  ],
  "gyeonggi-bucheon-sosa": [{ value: "catholic", label: "가톨릭대학교 성심교정" }],
  "gyeonggi-uijeongbu": [{ value: "shinhan", label: "신한대학교 의정부캠퍼스" }],
  "gyeonggi-pyeongtaek": [
    { value: "pyeongtaek", label: "평택대학교" },
    { value: "kookje", label: "국제대학교" },
  ],
  "gyeonggi-gwangmyeong": [{ value: "kopo-gwangmyeong", label: "한국폴리텍대학 광명융합기술교육원" }],
  "gyeonggi-siheung": [{ value: "kpu", label: "한국공학대학교" }],
  "gyeonggi-gunpo": [{ value: "hansei", label: "한세대학교" }],
  "gyeonggi-osan": [{ value: "osan", label: "오산대학교" }],
  "gyeonggi-namyangju": [{ value: "sahmyook-namyangju", label: "삼육대학교 남양주 생활권" }],
  "gyeonggi-paju": [{ value: "doowon-paju", label: "두원공과대학교 파주캠퍼스" }],
  "gyeonggi-icheon": [{ value: "cheonggang", label: "청강문화산업대학교" }],
  "gyeonggi-anseong": [
    { value: "chungang-anseong", label: "중앙대학교 안성캠퍼스" },
    { value: "hankyong", label: "한경국립대학교" },
  ],
  "gyeonggi-gimpo": [{ value: "kimpo", label: "김포대학교" }],
  "gyeonggi-gwangju": [{ value: "dongwon", label: "동원대학교" }],
  "gyeonggi-pocheon": [
    { value: "cha", label: "차의과학대학교" },
    { value: "daejin", label: "대진대학교" },
  ],
  "incheon-bupyeong": [
    { value: "inha", label: "인하대학교" },
    { value: "jeonmun", label: "인천재능대학교" },
  ],
  "incheon-yeonsu": [
    { value: "incheon", label: "인천대학교" },
    { value: "yonsei-intl", label: "연세대학교 국제캠퍼스" },
  ],
  "incheon-michuhol": [
    { value: "inha", label: "인하대학교" },
    { value: "inha-tech", label: "인하공업전문대학" },
  ],
  "incheon-namdong": [{ value: "gachon-med", label: "가천대학교 메디컬캠퍼스" }],
  "incheon-seo": [{ value: "incheon", label: "인천대학교" }],
  "incheon-gyeyang": [{ value: "kyungin-edu", label: "경인교육대학교 인천캠퍼스 생활권" }],
  "busan-geumjeong": [{ value: "pusan", label: "부산대학교" }],
  "busan-nam": [
    { value: "kyungsung", label: "경성대학교" },
    { value: "pknu", label: "국립부경대학교" },
    { value: "dongmyung", label: "동명대학교" },
  ],
  "busan-busanjin": [
    { value: "dong-eui", label: "동의대학교" },
    { value: "dongseo", label: "동서대학교" },
  ],
  "busan-sasang": [{ value: "dongseo", label: "동서대학교" }],
  "busan-haeundae": [{ value: "pknu-centum", label: "국립부경대학교 센텀권 생활권" }],
  "busan-seo": [
    { value: "donga-bumin", label: "동아대학교 부민캠퍼스" },
    { value: "kosin-songdo", label: "고신대학교 송도캠퍼스" },
  ],
  "busan-yeongdo": [{ value: "kmou", label: "한국해양대학교" }],
  "busan-dongnae": [{ value: "busan-edu", label: "부산교육대학교" }],
  "busan-buk": [{ value: "busan-tech", label: "부산과학기술대학교" }],
  "busan-saha": [{ value: "donga-seunghak", label: "동아대학교 승학캠퍼스" }],
  "busan-gangseo": [{ value: "busan-catholic", label: "부산가톨릭대학교 강서 생활권" }],
  "busan-yeonje": [{ value: "busan-edu", label: "부산교육대학교 생활권" }],
  "busan-suyeong": [{ value: "pknu", label: "국립부경대학교 생활권" }],
  "daegu-jung": [{ value: "kyungpook-med", label: "경북대학교 의과대학 생활권" }],
  "daegu-dong": [{ value: "yeungjin", label: "영진전문대학교 복현/동구 생활권" }],
  "daegu-seo": [{ value: "daegu-health", label: "대구보건대학교 생활권" }],
  "daegu-buk": [
    { value: "knu", label: "경북대학교 대구캠퍼스" },
    { value: "yeungjin", label: "영진전문대학교" },
  ],
  "daegu-nam": [
    { value: "keimyung-daemyeong", label: "계명대학교 대명캠퍼스" },
    { value: "daegu-catholic-med", label: "대구가톨릭대학교 의학권" },
  ],
  "daegu-dalseo": [{ value: "keimyung", label: "계명대학교 성서캠퍼스" }],
  "daegu-suseong": [
    { value: "suseong", label: "수성대학교" },
    { value: "daegu-haany", label: "대구한의대학교 생활권" },
  ],
  "daegu-dalseong": [{ value: "dgist", label: "DGIST" }],
  "daejeon-yuseong": [
    { value: "kaist", label: "KAIST" },
    { value: "cnu", label: "충남대학교" },
    { value: "hanbat", label: "한밭대학교" },
  ],
  "daejeon-jung": [{ value: "mokwon", label: "목원대학교" }],
  "daejeon-seo": [
    { value: "paichai", label: "배재대학교" },
    { value: "mokwon", label: "목원대학교" },
  ],
  "daejeon-dong": [{ value: "woosong", label: "우송대학교" }],
  "daejeon-daedeok": [{ value: "hanbat", label: "한밭대학교 대덕산학융합캠퍼스 생활권" }],
  "gwangju-dong": [
    { value: "chosun", label: "조선대학교" },
    { value: "gwangju-edu", label: "광주교육대학교" },
  ],
  "gwangju-buk": [
    { value: "jnu", label: "전남대학교 광주캠퍼스" },
    { value: "gwangju-health", label: "광주보건대학교" },
  ],
  "gwangju-seo": [{ value: "honam", label: "호남대학교 쌍촌권 생활권" }],
  "gwangju-gwangsan": [{ value: "honam", label: "호남대학교" }],
  "gwangju-nam": [{ value: "gwangju-univ", label: "광주대학교" }],
  "ulsan-nam": [{ value: "ulsan", label: "울산대학교" }],
  "ulsan-jung": [{ value: "uc-west", label: "울산과학대학교 서부캠퍼스" }],
  "ulsan-buk": [{ value: "unist", label: "UNIST" }],
  "ulsan-dong": [{ value: "uc-east", label: "울산과학대학교 동부캠퍼스" }],
  "ulsan-ulju": [{ value: "unist", label: "UNIST" }],
  "sejong-jochiwon": [
    { value: "korea-sejong", label: "고려대학교 세종캠퍼스" },
    { value: "hongik-sejong", label: "홍익대학교 세종캠퍼스" },
    { value: "korea-video", label: "한국영상대학교" },
  ],
  "sejong-jiphyeon": [{ value: "sci-tech-sejong", label: "세종공동캠퍼스" }],
  "sejong-saerom": [{ value: "sejong-living", label: "세종 중심생활권" }],
  "sejong-dodam": [{ value: "sci-tech-sejong", label: "세종공동캠퍼스 생활권" }],
  "gangwon-chuncheon": [
    { value: "kangwon", label: "강원대학교 춘천캠퍼스" },
    { value: "hallym", label: "한림대학교" },
  ],
  "gangwon-wonju": [
    { value: "yonsei-mirae", label: "연세대학교 미래캠퍼스" },
    { value: "sangji", label: "상지대학교" },
  ],
  "gangwon-gangneung": [
    { value: "gwnu", label: "강릉원주대학교 강릉캠퍼스" },
    { value: "catholic-kwandong", label: "가톨릭관동대학교" },
  ],
  "gangwon-samcheok": [{ value: "kangwon-samcheok", label: "강원대학교 삼척캠퍼스" }],
  "gangwon-sokcho": [{ value: "kyungdong-global", label: "경동대학교 글로벌캠퍼스 생활권" }],
  "gangwon-hongcheon": [{ value: "songgok", label: "송곡대학교 홍천 생활권" }],
  "chungbuk-cheongju-seowon": [
    { value: "cbnu", label: "충북대학교" },
    { value: "seowon", label: "서원대학교" },
  ],
  "chungbuk-cheongju-heungdeok": [
    { value: "cbnu", label: "충북대학교" },
    { value: "cju", label: "청주대학교 생활권" },
  ],
  "chungbuk-cheongju-sangdang": [{ value: "cju", label: "청주대학교" }],
  "chungbuk-cheongju-cheongwon": [
    { value: "cju", label: "청주대학교" },
    { value: "chungbuk-health", label: "충북보건과학대학교" },
  ],
  "chungbuk-chungju": [
    { value: "kku", label: "건국대학교 글로컬캠퍼스" },
    { value: "korea-national", label: "한국교통대학교" },
  ],
  "chungbuk-jecheon": [
    { value: "semyung", label: "세명대학교" },
    { value: "daewon", label: "대원대학교" },
  ],
  "chungbuk-jincheon": [{ value: "woosuk-jincheon", label: "우석대학교 진천캠퍼스" }],
  "chungbuk-eumseong": [{ value: "gangdong", label: "강동대학교" }],
  "chungnam-cheonan-dongnam": [
    { value: "dankook-cheonan", label: "단국대학교 천안캠퍼스" },
    { value: "hoseo-cheonan", label: "호서대학교 천안캠퍼스" },
  ],
  "chungnam-cheonan-seobuk": [
    { value: "sangmyung-cheonan", label: "상명대학교 천안캠퍼스" },
    { value: "baekseok-univ", label: "백석대학교" },
  ],
  "chungnam-asan": [
    { value: "sunmoon", label: "선문대학교" },
    { value: "hoseo", label: "호서대학교 아산캠퍼스" },
  ],
  "chungnam-gongju": [
    { value: "kongju", label: "국립공주대학교" },
    { value: "kongju-edu", label: "공주교육대학교" },
  ],
  "chungnam-boryeong": [{ value: "ajou-motor", label: "아주자동차대학교" }],
  "chungnam-seosan": [{ value: "hanseo", label: "한서대학교" }],
  "chungnam-nonsan": [
    { value: "konyang", label: "건양대학교" },
    { value: "geumgang", label: "금강대학교" },
  ],
  "chungnam-dangjin": [{ value: "shinsung", label: "신성대학교" }],
  "chungnam-geumsan": [{ value: "joongbu", label: "중부대학교 충청캠퍼스" }],
  "chungnam-hongseong": [{ value: "chungwoon", label: "청운대학교" }],
  "jeonbuk-jeonju-deokjin": [
    { value: "jbnu", label: "전북대학교" },
    { value: "jeonju-edu", label: "전주교육대학교" },
  ],
  "jeonbuk-jeonju-wansan": [
    { value: "jeonju", label: "전주대학교" },
    { value: "woosuk-jeonju", label: "우석대학교 전주권 생활권" },
  ],
  "jeonbuk-gunsan": [{ value: "kunsan", label: "군산대학교" }],
  "jeonbuk-iksan": [{ value: "wku", label: "원광대학교" }],
  "jeonbuk-jeongeup": [{ value: "jeonbuk-science", label: "전북과학대학교" }],
  "jeonbuk-wanju": [{ value: "woosuk", label: "우석대학교" }],
  "jeonnam-mokpo": [
    { value: "mokpo", label: "국립목포대학교" },
    { value: "mokpo-marine", label: "국립목포해양대학교" },
  ],
  "jeonnam-suncheon": [{ value: "scnu", label: "국립순천대학교" }],
  "jeonnam-yeosu": [{ value: "jnu-yeosu", label: "전남대학교 여수캠퍼스" }],
  "jeonnam-naju": [
    { value: "dongshin", label: "동신대학교" },
    { value: "korea-energy", label: "한국에너지공과대학교" },
  ],
  "jeonnam-hwasun": [{ value: "jnu-hwasun", label: "전남대학교 화순캠퍼스 생활권" }],
  "jeonnam-yeongam": [{ value: "sehan", label: "세한대학교" }],
  "jeonnam-muan": [{ value: "chodang", label: "초당대학교" }],
  "gyeongbuk-pohang-nam": [
    { value: "postech", label: "POSTECH" },
    { value: "handong", label: "한동대학교 생활권" },
  ],
  "gyeongbuk-gyeongsan": [
    { value: "yeungnam", label: "영남대학교" },
    { value: "daegu-catholic", label: "대구가톨릭대학교" },
    { value: "daegu-haany", label: "대구한의대학교" },
  ],
  "gyeongbuk-gyeongju": [{ value: "dongguk-wise", label: "동국대학교 WISE캠퍼스" }],
  "gyeongbuk-andong": [{ value: "andong", label: "국립안동대학교" }],
  "gyeongbuk-pohang-buk": [{ value: "handong", label: "한동대학교" }],
  "gyeongbuk-gimcheon": [{ value: "gimcheon", label: "김천대학교" }],
  "gyeongbuk-gumi": [{ value: "kumoh", label: "국립금오공과대학교" }],
  "gyeongbuk-yeongju": [{ value: "dongyang", label: "동양대학교" }],
  "gyeongbuk-yeongcheon": [{ value: "sungduk", label: "성운대학교" }],
  "gyeongbuk-sangju": [{ value: "knu-sangju", label: "경북대학교 상주캠퍼스" }],
  "gyeongbuk-mungyeong": [{ value: "mungeong", label: "문경대학교" }],
  "gyeongbuk-chilgok": [{ value: "kaya-chilgok", label: "가야대학교 칠곡 생활권" }],
  "gyeongnam-changwon-uichang": [
    { value: "changwon", label: "창원대학교" },
    { value: "korea-naval", label: "경남권 국공립대 생활권" },
  ],
  "gyeongnam-jinju": [
    { value: "gnu", label: "경상국립대학교 가좌캠퍼스" },
    { value: "jinju-edu", label: "진주교육대학교" },
  ],
  "gyeongnam-gimhae": [
    { value: "inje", label: "인제대학교" },
    { value: "kaya", label: "가야대학교" },
  ],
  "gyeongnam-yangsan": [{ value: "pusan-yangsan", label: "부산대학교 양산캠퍼스" }],
  "gyeongnam-changwon-seongsan": [{ value: "changwon", label: "창원대학교 생활권" }],
  "gyeongnam-changwon-masanhappo": [{ value: "masan", label: "마산대학교 생활권" }],
  "gyeongnam-changwon-masanhoewon": [{ value: "masan", label: "마산대학교" }],
  "gyeongnam-changwon-jinhae": [{ value: "korea-naval", label: "해군사관학교 생활권" }],
  "gyeongnam-tongyeong": [{ value: "gyeongsang-tongyeong", label: "경상국립대학교 통영캠퍼스" }],
  "gyeongnam-sacheon": [{ value: "korea-aero", label: "한국폴리텍대학 항공캠퍼스" }],
  "gyeongnam-miryang": [{ value: "pusan-miryang", label: "부산대학교 밀양캠퍼스" }],
  "gyeongnam-geoje": [{ value: "koje", label: "거제대학교" }],
  "gyeongnam-haman": [{ value: "masan-haman", label: "마산대학교 함안 생활권" }],
  "gyeongnam-geochang": [{ value: "gyeongnam-geochang", label: "경남도립거창대학" }],
  "gyeongnam-namhae": [{ value: "gyeongnam-namhae", label: "경남도립남해대학" }],
  "jeju-jeju": [
    { value: "jejunu", label: "제주대학교" },
    { value: "jeju-tourism", label: "제주관광대학교" },
  ],
  "jeju-seogwipo": [{ value: "jejuhanla", label: "제주한라대학교 생활권" }],
};

const DISTRICT_OPTIONS_FLAT = Object.values(DISTRICT_OPTIONS_BY_REGION).flat();
const UNIVERSITY_OPTIONS_FLAT = Object.values(UNIVERSITY_OPTIONS_BY_DISTRICT).flat();

export const INCOME_OPTIONS: ProfileOption[] = [
  { value: "under-200", label: "200만 원 미만" },
  { value: "200-350", label: "200만~350만 원" },
  { value: "350-500", label: "350만~500만 원" },
  { value: "500-plus", label: "500만 원 이상" },
];

const LEGACY_INCOME_OPTIONS: ProfileOption[] = [
  { value: "under-100", label: "100만 원 미만" },
  { value: "100-200", label: "100만~200만 원" },
  { value: "200-300", label: "200만~300만 원" },
  { value: "300-400", label: "300만~400만 원" },
  { value: "400-500", label: "400만~500만 원" },
  { value: "300-500", label: "300만~500만 원" },
  { value: "over-500", label: "500만 원 이상" },
];

export const REGION_OPTIONS: Array<{ value: RegionCode; label: string }> = [
  { value: "seoul", label: "서울특별시" },
  { value: "gyeonggi", label: "경기도" },
  { value: "incheon", label: "인천광역시" },
  { value: "busan", label: "부산광역시" },
  { value: "daegu", label: "대구광역시" },
  { value: "daejeon", label: "대전광역시" },
  { value: "gwangju", label: "광주광역시" },
  { value: "ulsan", label: "울산광역시" },
  { value: "sejong", label: "세종특별자치시" },
  { value: "gangwon", label: "강원특별자치도" },
  { value: "chungbuk", label: "충청북도" },
  { value: "chungnam", label: "충청남도" },
  { value: "jeonbuk", label: "전북특별자치도" },
  { value: "jeonnam", label: "전라남도" },
  { value: "gyeongbuk", label: "경상북도" },
  { value: "gyeongnam", label: "경상남도" },
  { value: "jeju", label: "제주특별자치도" },
];

export function getDistrictOptions(region?: string) {
  if (!region || region === "all") {
    return [];
  }

  return DISTRICT_OPTIONS_BY_REGION[region as RegionCode] ?? [];
}

export function getUniversityOptions(district?: string) {
  if (!district || district === "all") {
    return [];
  }

  return UNIVERSITY_OPTIONS_BY_DISTRICT[district] ?? [];
}

export function getIncomeLabel(income?: string) {
  if (!income) {
    return "-";
  }

  return [...INCOME_OPTIONS, ...LEGACY_INCOME_OPTIONS].find((option) => option.value === income)?.label ?? income;
}

export function getIncomeOptionsForSelect(currentIncome?: string) {
  if (!currentIncome) {
    return INCOME_OPTIONS;
  }

  const legacyOption = LEGACY_INCOME_OPTIONS.find((option) => option.value === currentIncome);

  if (!legacyOption) {
    return INCOME_OPTIONS;
  }

  return [...INCOME_OPTIONS, { ...legacyOption, label: `${legacyOption.label} (기존 설정)` }];
}

export function getRegionLabel(region?: string) {
  if (!region) {
    return "-";
  }

  if (region === "all") {
    return "전체 지역";
  }

  return REGION_OPTIONS.find((option) => option.value === region)?.label ?? region;
}

export function getDistrictLabel(region?: string, district?: string) {
  if (!district) {
    return "-";
  }

  const scopedOptions = region ? getDistrictOptions(region) : DISTRICT_OPTIONS_FLAT;
  return scopedOptions.find((option) => option.value === district)?.label ?? district;
}

export function getUniversityLabel(district?: string, university?: string) {
  if (!university) {
    return "-";
  }

  const scopedOptions = district ? getUniversityOptions(district) : UNIVERSITY_OPTIONS_FLAT;
  return scopedOptions.find((option) => option.value === university)?.label ?? university;
}

export function getResidenceSummary(profile?: Partial<UserProfile>) {
  if (!profile?.region) {
    return "거주 희망 지역을 아직 설정하지 않았어요";
  }

  const segments = [getRegionLabel(profile.region)];

  if (profile.district) {
    segments.push(getDistrictLabel(profile.region, profile.district));
  }

  if (profile.university) {
    segments.push(getUniversityLabel(profile.district, profile.university));
  }

  return segments.join(" · ");
}
