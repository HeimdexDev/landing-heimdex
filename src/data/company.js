// Company pages (/company/about · news · brand · careers).
//
// Copy for 소개 comes from the company-content doc (docs/landing-company-content.md,
// git e51ec84) and the brand architecture from wireframe 00. Keep every claim to
// what those sources state — add news items and open positions here as they
// are confirmed, and the pages pick them up.

export const COMPANY_TABS = [
  { key: 'about', label: '소개', en: 'About', to: '/company/about' },
  { key: 'news', label: '소식', en: 'News', to: '/company/news' },
  { key: 'brand', label: '브랜드', en: 'Brand', to: '/company/brand' },
  { key: 'careers', label: '채용', en: 'Careers', to: '/company/careers' },
]

export const CONTACT = {
  email: 'heimdex@heimdex.co',
  address: '서울특별시 마포구 백범로31길 21',
  addressEn: '21 Baekbeom-ro 31-gil, Mapo-gu, Seoul, Korea',
}

export const VALUES = [
  {
    title: '혁신',
    titleEn: 'Innovation',
    desc: '영상 AI 기술로 가능한 것의 경계를 넓힙니다.',
    descEn: 'We push the limits of what video AI can do.',
  },
  {
    title: '프라이버시 우선',
    titleEn: 'Privacy first',
    desc: '영상은 외부로 나가지 않습니다. 클라우드가 아닌 현장에서 분석합니다.',
    descEn: 'Your footage never leaves. We analyze on site, not in the cloud.',
  },
  {
    title: '크리에이터 임파워먼트',
    titleEn: 'Creator empowerment',
    desc: '사람의 창의성을 대체하는 것이 아니라 증폭시키는 도구를 만듭니다.',
    descEn: 'We build tools that amplify human creativity, not replace it.',
  },
  {
    title: '투명성',
    titleEn: 'Transparency',
    desc: '결과가 어떻게, 왜 나왔는지 항상 알 수 있는 설명 가능한 AI를 만듭니다.',
    descEn: 'Explainable AI — you can always see how and why a result came up.',
  },
]

// `icon` keys map to components/icons3d.jsx in the page.
export const CAPABILITIES = [
  {
    icon: 'layers',
    title: '멀티모달 이해',
    titleEn: 'Multimodal understanding',
    desc: '영상 · 오디오 · 텍스트 · 메타데이터를 함께 분석합니다.',
    descEn: 'Video, audio, text and metadata, analyzed together.',
  },
  {
    icon: 'search',
    title: '의미 기반 검색',
    titleEn: 'Semantic search',
    desc: '키워드가 아닌 의미로 장면을 찾습니다.',
    descEn: 'Find scenes by meaning, not keywords.',
  },
  {
    icon: 'nocloud',
    title: '제로 업로드 아키텍처',
    titleEn: 'Zero-upload architecture',
    desc: 'NAS · 클라우드 스토리지 · 로컬 드라이브 등 영상이 있는 곳에서 바로 처리합니다.',
    descEn: 'Processes footage where it lives — NAS, cloud storage, local drives.',
  },
  {
    icon: 'alert',
    title: '실시간 모니터링',
    titleEn: 'Real-time monitoring',
    desc: '플랫폼 전반의 무단 배포를 자동으로 감지합니다.',
    descEn: 'Automatically detects unauthorized distribution across platforms.',
  },
]

// 소식. `date` is optional (ISO yyyy-mm) — leave it out until confirmed.
export const NEWS_CATEGORIES = [
  { key: 'funding', label: '투자', en: 'Funding' },
  { key: 'program', label: '선정', en: 'Selections' },
  { key: 'award', label: '수상', en: 'Awards' },
  { key: 'media', label: '방송', en: 'Media' },
]

export const NEWS = [
  {
    cat: 'funding',
    logo: '/assets/logo-antler.png',
    title: '글로벌 벤처 빌더 Antler 투자 유치',
    titleEn: 'Backed by global venture builder Antler',
    desc: '하임덱스는 전 세계 25개 이상의 도시에서 초기 스타트업을 지원하는 글로벌 벤처 빌더 Antler의 투자를 받아 영상 인텔리전스 기술을 발전시키고 있습니다.',
    descEn:
      'Heimdex is backed by Antler, a global venture builder supporting early-stage startups in 25+ cities, as it advances its video intelligence technology.',
  },
  {
    cat: 'program',
    logo: '/assets/logo-nvidia.png',
    title: 'NVIDIA Inception 프로그램 참여',
    titleEn: 'Member of NVIDIA Inception',
    desc: 'AI 스타트업을 위한 NVIDIA의 지원 프로그램 Inception에 참여하고 있습니다.',
    descEn: 'Heimdex is part of NVIDIA Inception, NVIDIA’s program for AI startups.',
  },
]

// 채용. Empty until a role is open — the page shows an empty state.
// Shape: { team, teamEn, title, titleEn, type, typeEn, href }
export const POSITIONS = []
