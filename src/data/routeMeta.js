// Search-result title and description per public route, keyed by the Korean
// path; each entry carries both languages. Read by scripts/prerender.mjs (static
// <head>) and src/i18n/SeoLinks.jsx (client-side navigation), and bounded by
// scripts/verify-prerender.mjs (title <= 60, description <= 155 characters).
// Plain text: prerender escapes & < > " when it writes the HTML.
export const ROUTE_META = {
  '/': {
    ko: {
      title: 'HEIMDEX — 영상 속 원하는 장면, 검색 한 줄로',
      description:
        '업로드 없이, 시청 없이. 검색 한 줄로 필요한 장면을 찾고 숏폼까지 자동으로 만들어 드립니다.',
    },
    en: {
      title: 'HEIMDEX — The scene you need, in a single search',
      description:
        'No uploads, no watching. One search finds the scene you need — and even builds the short-form for you.',
    },
  },
  '/product': {
    ko: {
      title: 'HEIMDEX 제품 — 산업별 영상 활용 사례',
      description:
        '브이로그 크리에이터, 로펌·수사, 마케터·PD, 데이터·연구까지. 산업별 사례로 하임덱스가 영상의 가치를 높이는 방법을 확인하세요.',
    },
    en: {
      title: 'HEIMDEX Product — Video solutions by industry',
      description:
        'Heimdex maximizes the value of video across industries: vlog creators, legal and investigation, marketers and producers, data and research.',
    },
  },
  '/contact': {
    ko: {
      title: 'HEIMDEX 문의 — 데모 상담 신청',
      description:
        '15분 상담으로 영상 관리에서 시간이 새는 지점을 진단하고, 하임덱스가 줄여줄 작업 시간을 함께 계산해드립니다.',
    },
    en: {
      title: 'HEIMDEX Contact — Request a Demo',
      description:
        "In a 15-minute consultation, we'll diagnose where time leaks in your video workflow and the hours Heimdex can save you.",
    },
  },
  '/policy': {
    ko: {
      title: 'HEIMDEX 약관 — 이용약관·개인정보 처리방침',
      description: '하임덱스(HEIMDEX) 영상 분석·인덱싱 서비스의 이용약관과 개인정보 처리방침을 안내합니다.',
    },
    en: {
      title: 'HEIMDEX Policy — Terms of Service and Privacy Policy',
      description:
        'Terms of Service and Privacy Policy for the Heimdex video analysis and indexing service.',
    },
  },
}
