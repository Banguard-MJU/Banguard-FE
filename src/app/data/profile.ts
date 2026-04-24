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
    { value: "seoul-seongdong", label: "성동구" },
    { value: "seoul-mapo", label: "마포구" },
    { value: "seoul-seodaemun", label: "서대문구" },
    { value: "seoul-dongdaemun", label: "동대문구" },
    { value: "seoul-gwanak", label: "관악구" },
    { value: "seoul-dongjak", label: "동작구" },
    { value: "seoul-seongbuk", label: "성북구" },
    { value: "seoul-nowon", label: "노원구" },
    { value: "seoul-gangseo", label: "강서구" },
    { value: "seoul-songpa", label: "송파구" },
  ],
  gyeonggi: [
    { value: "gyeonggi-suwon-yeongtong", label: "수원시 영통구" },
    { value: "gyeonggi-seongnam-bundang", label: "성남시 분당구" },
    { value: "gyeonggi-yongin-suji", label: "용인시 수지구" },
    { value: "gyeonggi-ansan-sangnok", label: "안산시 상록구" },
    { value: "gyeonggi-anyang-dongan", label: "안양시 동안구" },
    { value: "gyeonggi-goyang-deogyang", label: "고양시 덕양구" },
    { value: "gyeonggi-hwaseong-dongtan", label: "화성시 동탄권" },
    { value: "gyeonggi-bucheon-wonmi", label: "부천시 원미구" },
  ],
  incheon: [
    { value: "incheon-bupyeong", label: "부평구" },
    { value: "incheon-yeonsu", label: "연수구" },
    { value: "incheon-michuhol", label: "미추홀구" },
    { value: "incheon-namdong", label: "남동구" },
    { value: "incheon-seo", label: "서구" },
  ],
  busan: [
    { value: "busan-geumjeong", label: "금정구" },
    { value: "busan-nam", label: "남구" },
    { value: "busan-busanjin", label: "부산진구" },
    { value: "busan-sasang", label: "사상구" },
    { value: "busan-haeundae", label: "해운대구" },
  ],
  daegu: [
    { value: "daegu-buk", label: "북구" },
    { value: "daegu-nam", label: "남구" },
    { value: "daegu-dalseo", label: "달서구" },
    { value: "daegu-suseong", label: "수성구" },
  ],
  daejeon: [
    { value: "daejeon-yuseong", label: "유성구" },
    { value: "daejeon-jung", label: "중구" },
    { value: "daejeon-seo", label: "서구" },
    { value: "daejeon-dong", label: "동구" },
  ],
  gwangju: [
    { value: "gwangju-dong", label: "동구" },
    { value: "gwangju-buk", label: "북구" },
    { value: "gwangju-seo", label: "서구" },
    { value: "gwangju-gwangsan", label: "광산구" },
  ],
  ulsan: [
    { value: "ulsan-nam", label: "남구" },
    { value: "ulsan-jung", label: "중구" },
    { value: "ulsan-buk", label: "북구" },
  ],
  sejong: [
    { value: "sejong-jochiwon", label: "조치원읍" },
    { value: "sejong-jiphyeon", label: "집현동" },
    { value: "sejong-saerom", label: "새롬동" },
  ],
  gangwon: [
    { value: "gangwon-chuncheon", label: "춘천시" },
    { value: "gangwon-wonju", label: "원주시" },
    { value: "gangwon-gangneung", label: "강릉시" },
    { value: "gangwon-samcheok", label: "삼척시" },
  ],
  chungbuk: [
    { value: "chungbuk-cheongju-seowon", label: "청주시 서원구" },
    { value: "chungbuk-cheongju-heungdeok", label: "청주시 흥덕구" },
    { value: "chungbuk-cheongju-sangdang", label: "청주시 상당구" },
    { value: "chungbuk-chungju", label: "충주시" },
  ],
  chungnam: [
    { value: "chungnam-cheonan-dongnam", label: "천안시 동남구" },
    { value: "chungnam-cheonan-seobuk", label: "천안시 서북구" },
    { value: "chungnam-asan", label: "아산시" },
    { value: "chungnam-gongju", label: "공주시" },
  ],
  jeonbuk: [
    { value: "jeonbuk-jeonju-deokjin", label: "전주시 덕진구" },
    { value: "jeonbuk-jeonju-wansan", label: "전주시 완산구" },
    { value: "jeonbuk-gunsan", label: "군산시" },
    { value: "jeonbuk-iksan", label: "익산시" },
  ],
  jeonnam: [
    { value: "jeonnam-mokpo", label: "목포시" },
    { value: "jeonnam-suncheon", label: "순천시" },
    { value: "jeonnam-yeosu", label: "여수시" },
    { value: "jeonnam-muan", label: "무안군" },
  ],
  gyeongbuk: [
    { value: "gyeongbuk-pohang-nam", label: "포항시 남구" },
    { value: "gyeongbuk-gyeongsan", label: "경산시" },
    { value: "gyeongbuk-gyeongju", label: "경주시" },
    { value: "gyeongbuk-andong", label: "안동시" },
  ],
  gyeongnam: [
    { value: "gyeongnam-changwon-uichang", label: "창원시 의창구" },
    { value: "gyeongnam-jinju", label: "진주시" },
    { value: "gyeongnam-gimhae", label: "김해시" },
    { value: "gyeongnam-yangsan", label: "양산시" },
  ],
  jeju: [
    { value: "jeju-jeju", label: "제주시" },
    { value: "jeju-seogwipo", label: "서귀포시" },
  ],
};

const UNIVERSITY_OPTIONS_BY_DISTRICT: Record<string, ProfileOption[]> = {
  "seoul-seongdong": [{ value: "hanyang", label: "한양대학교" }],
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
  "seoul-songpa": [{ value: "knsu", label: "한국체육대학교" }],
  "gyeonggi-suwon-yeongtong": [
    { value: "ajou", label: "아주대학교" },
    { value: "kyonggi-suwon", label: "경기대학교 수원캠퍼스" },
    { value: "suwon", label: "수원대학교" },
  ],
  "gyeonggi-seongnam-bundang": [
    { value: "gachon-global", label: "가천대학교 글로벌캠퍼스" },
    { value: "cha", label: "차의과학대학교" },
  ],
  "gyeonggi-yongin-suji": [
    { value: "dankook-jukjeon", label: "단국대학교 죽전캠퍼스" },
    { value: "kyonggi-suwon", label: "경기대학교 수원캠퍼스" },
  ],
  "gyeonggi-ansan-sangnok": [
    { value: "hanyang-erica", label: "한양대학교 ERICA캠퍼스" },
    { value: "seoul-arts", label: "서울예술대학교" },
  ],
  "gyeonggi-anyang-dongan": [
    { value: "anyang", label: "안양대학교" },
    { value: "sungkyul", label: "성결대학교" },
  ],
  "gyeonggi-goyang-deogyang": [{ value: "kau", label: "한국항공대학교" }],
  "gyeonggi-hwaseong-dongtan": [
    { value: "hanshin", label: "한신대학교" },
    { value: "suwon", label: "수원대학교" },
  ],
  "gyeonggi-bucheon-wonmi": [
    { value: "bucheon", label: "부천대학교" },
    { value: "catholic", label: "가톨릭대학교 성심교정" },
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
  "ulsan-nam": [{ value: "ulsan", label: "울산대학교" }],
  "ulsan-jung": [{ value: "uc-west", label: "울산과학대학교 서부캠퍼스" }],
  "ulsan-buk": [{ value: "unist", label: "UNIST" }],
  "sejong-jochiwon": [
    { value: "korea-sejong", label: "고려대학교 세종캠퍼스" },
    { value: "hongik-sejong", label: "홍익대학교 세종캠퍼스" },
    { value: "korea-video", label: "한국영상대학교" },
  ],
  "sejong-jiphyeon": [{ value: "sci-tech-sejong", label: "세종공동캠퍼스" }],
  "sejong-saerom": [{ value: "sejong-living", label: "세종 중심생활권" }],
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
  "chungbuk-cheongju-seowon": [
    { value: "cbnu", label: "충북대학교" },
    { value: "seowon", label: "서원대학교" },
  ],
  "chungbuk-cheongju-heungdeok": [
    { value: "cbnu", label: "충북대학교" },
    { value: "cju", label: "청주대학교 생활권" },
  ],
  "chungbuk-cheongju-sangdang": [{ value: "cju", label: "청주대학교" }],
  "chungbuk-chungju": [
    { value: "kku", label: "건국대학교 글로컬캠퍼스" },
    { value: "korea-national", label: "한국교통대학교" },
  ],
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
  "jeonnam-mokpo": [
    { value: "mokpo", label: "국립목포대학교" },
    { value: "mokpo-marine", label: "국립목포해양대학교" },
  ],
  "jeonnam-suncheon": [{ value: "scnu", label: "국립순천대학교" }],
  "jeonnam-yeosu": [{ value: "jnu-yeosu", label: "전남대학교 여수캠퍼스" }],
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
