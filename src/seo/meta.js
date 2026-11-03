import { INDUSTRIES, FEATURES, industryPath } from '../data/industries.js'
import { KO } from '../data/dataMarket.ko.js'
import { collectionPath, dataCopy } from '../data/dataMarket.js'
import { SHOW_COMPANY_LINKS } from '../data/flags.js'

// Per-page <title>/<meta description>, used twice: scripts/prerender.mjs bakes
// them into each page's static HTML (what search and AI crawlers read), and
// RouteMeta swaps them in on client-side navigation. Paths are canonical
// (Korean, no /en prefix).
//
// Titles lead with the brand + category keywords and carry a concrete
// differentiator (no uploads · on-premise · 5 industries · free 1-month PoC);
// keep every claim to what the site itself states.

export const ORIGIN = 'https://www.heimdex.co'

const SUFFIX = ' | HEIMDEX'
const SUFFIX_EN = ' | HEIMDEX'

const HOME = {
  title: 'HEIMDEX — 업로드 없는 온프레미스 AI 영상 검색 · 무료 1달 PoC',
  titleEn: 'HEIMDEX — On-premise AI video search, no uploads · Free 1-month PoC',
  description:
    '원본 영상을 외부 서버에 올리지 않고 NAS·서버·PC에서 바로 분석하는 AI 영상 검색 솔루션. 말하듯 한 줄로 원하는 장면을 찾고 숏폼·하이라이트까지 자동으로 만듭니다. 라이브커머스·미디어·교육·로펌·연구 5개 산업, 무료 1달 PoC.',
  descriptionEn:
    'AI video search that analyzes footage where it lives — NAS, servers and PCs — with no uploads. Find any scene in one sentence and auto-generate shorts and highlights. Built for live commerce, media, education, legal and research. Free 1-month PoC.',
}

// Pages from the v1.2 IA that aren't designed yet (see pages/ComingSoon.jsx).
// Thin placeholders, so they are kept out of the index.
export const COMING_SOON = {
  '/product/business': ['HEIMDEX 제품 개요', 'HEIMDEX product overview'],
  '/heimlog/pricing': ['하임로그 요금제 · 크레딧', 'heimlog pricing & credits'],
  '/heimlog/guide': ['하임로그 사용 가이드', 'heimlog user guide'],
}
for (const f of FEATURES) COMING_SOON[`/product/business/${f.slug}`] = [f.name, f.name]

const PAGES = {
  '/': HOME,
  '/product': {
    title: '업종별 AI 영상 검색 데모 — 로펌·마케팅·연구·브이로그' + SUFFIX,
    titleEn: 'Interactive AI video search demo by industry' + SUFFIX_EN,
    description:
      '검색어 한 줄로 영상 속 장면을 찾고 클립·숏폼으로 만드는 과정을 업종별 데모로 직접 확인해 보세요. 원본 업로드 없이 동작하는 하임덱스 AI 영상 검색.',
    descriptionEn:
      'See, industry by industry, how one search line finds the scene and turns it into clips and shorts — Heimdex AI video search, with no uploads.',
  },
  '/contact': {
    title: '도입 문의 · 무료 1달 PoC 신청' + SUFFIX,
    titleEn: 'Contact sales · Request a free 1-month PoC' + SUFFIX_EN,
    description:
      '하임덱스 도입 상담과 무료 1달 PoC를 신청하세요. 우리 회사 영상 데이터에서 온프레미스 AI 영상 검색을 먼저 검증해 볼 수 있습니다.',
    descriptionEn:
      'Talk to Heimdex and request a free 1-month PoC — validate on-premise AI video search on your own footage first.',
  },
  '/policy': {
    title: '이용약관 · 개인정보처리방침' + SUFFIX,
    titleEn: 'Terms of Service · Privacy Policy' + SUFFIX_EN,
    description: '하임덱스 서비스 이용약관과 개인정보처리방침입니다.',
    descriptionEn: 'Heimdex Terms of Service and Privacy Policy.',
  },
  '/cases': {
    title: '도입 사례 — 라이브커머스·엔터·로펌·연구 고객 후기' + SUFFIX,
    titleEn: 'Customer stories — live commerce, media, legal, research' + SUFFIX_EN,
    description:
      '라이브커머스 PD, 엔터테인먼트 PD, 변호사, 피지컬 AI 연구 책임자가 하임덱스로 영상 검색 시간을 줄인 실제 후기를 확인하세요.',
    descriptionEn:
      'Real stories from live-commerce and entertainment producers, attorneys and physical-AI researchers who cut video search time with Heimdex.',
  },
}

Object.assign(PAGES, {
  '/data': {
    title: '데이터 마켓플레이스 — 방송 촬영 원본 · 화자별 트랙 · 멀티캠 AI 학습 데이터' + SUFFIX,
    titleEn: 'Data Marketplace — unaired production footage for AI training' + SUFFIX_EN,
    description:
      '국내 방송 · 라이브커머스 제작사와 직접 계약한 미방영 원본을 화자별 트랙 · 멀티캠 그대로 AI 학습 데이터로 제공합니다. 비독점 · 기간 한정, 2영업일 내 샘플 회신.',
    descriptionEn:
      'Unaired originals licensed directly from Korean broadcast and live-commerce producers, with per-speaker tracks and multi-cam intact. Non-exclusive, fixed-term; samples within 2 business days.',
  },
  '/request': {
    title: '샘플 요청 — 데이터 마켓플레이스' + SUFFIX,
    titleEn: 'Request a sample — Data Marketplace' + SUFFIX_EN,
    description: '필요한 데이터와 부족한 점을 알려주시면 꼭 맞는 샘플을 2영업일 안에 보내드려요.',
    descriptionEn: 'Tell us what your data is missing and we’ll send a matching sample within 2 business days.',
  },
  '/request/done': {
    title: '샘플 요청 접수 완료' + SUFFIX,
    titleEn: 'Sample request received' + SUFFIX_EN,
    description: '샘플 요청이 접수되었습니다.',
    descriptionEn: 'Your sample request has been received.',
    noindex: true,
  },
})

// 회사 pages — only prerendered / in the sitemap while SHOW_COMPANY_LINKS is on.
if (SHOW_COMPANY_LINKS) {
  Object.assign(PAGES, {
    '/company/about': {
      title: '회사 소개 — 영상 인텔리전스의 미래를 만듭니다' + SUFFIX,
      titleEn: 'About — Building the future of video intelligence' + SUFFIX_EN,
      description:
        '하임덱스는 모든 영상을 검색 가능하고, 재사용 가능하며, 보호된 상태로 만듭니다. 미션 · 가치 · AI Scene Intelligence 기술과 함께하는 파트너를 소개합니다.',
      descriptionEn:
        'Heimdex makes every video searchable, reusable and protected. Our mission, values, AI Scene Intelligence technology and the partners behind us.',
    },
    '/company/news': {
      title: '소식 — 투자 · 선정 · 수상 · 방송' + SUFFIX,
      titleEn: 'News — funding, selections, awards, media' + SUFFIX_EN,
      description: '하임덱스의 투자 · 선정 · 수상 · 방송 소식을 전합니다.',
      descriptionEn: 'Funding, selections, awards and media news from Heimdex.',
    },
    '/company/brand': {
      title: '브랜드 — 로고 · 컬러 · 타이포그래피' + SUFFIX,
      titleEn: 'Brand — logo, color, typography' + SUFFIX_EN,
      description: '하임덱스 로고, 브랜드 컬러, 타이포그래피와 하임로그 서브 브랜드 표기 원칙을 소개합니다.',
      descriptionEn: 'The Heimdex logo, brand colors, typography and how to credit the heimlog sub-brand.',
    },
    '/company/careers': {
      title: '채용 — 하임덱스 크루 되기' + SUFFIX,
      titleEn: 'Careers — Join the Heimdex crew' + SUFFIX_EN,
      description: '영상을 검색하고, 지키고, 다시 만드는 하임덱스와 함께할 동료를 찾습니다.',
      descriptionEn: 'Join Heimdex in searching, protecting and remaking the world’s video.',
    },
  })
}

for (const c of KO.collections) {
  const en = dataCopy('en').collections.find((x) => x.slug === c.slug)
  PAGES[collectionPath(c.slug)] = {
    title: `${c.name} — 데이터 마켓플레이스${SUFFIX}`,
    titleEn: `${en.name} — Data Marketplace${SUFFIX_EN}`,
    description: `${c.desc}. ${c.tags.join(' · ')} 학습용, 2영업일 내 샘플 회신.`,
    descriptionEn: `${en.desc}. For ${en.tags.join(' · ')}; samples within 2 business days.`,
  }
}

for (const ind of INDUSTRIES) {
  PAGES[industryPath(ind.slug)] = {
    title: `${ind.name} AI 영상 검색 — ${ind.card.join(' ')}${SUFFIX}`,
    titleEn: `AI video search for ${ind.nameEn} — ${ind.cardEn.join(' ')}${SUFFIX_EN}`,
    description: `${ind.name} 현장에 맞춘 하임덱스: ${ind.features
      .map((f) => f.title)
      .join(' · ')}. 원본을 외부로 보내지 않는 온프레미스 AI 영상 검색, 무료 1달 PoC.`,
    descriptionEn: `Heimdex for ${ind.nameEn}: ${ind.features
      .map((f) => f.titleEn)
      .join(' · ')}. On-premise AI video search that never sends your footage out. Free 1-month PoC.`,
  }
}

for (const [path, [ko, en]] of Object.entries(COMING_SOON)) {
  PAGES[path] = {
    title: ko + SUFFIX,
    titleEn: en + SUFFIX_EN,
    description: HOME.description,
    descriptionEn: HOME.descriptionEn,
    noindex: true,
  }
}

// Every path that gets its own static HTML at build time.
export const PRERENDER_PATHS = Object.keys(PAGES)

export function metaFor(path, lang) {
  const page = PAGES[path] ?? HOME
  const en = lang === 'en'
  return {
    title: en ? page.titleEn : page.title,
    description: en ? page.descriptionEn : page.description,
    noindex: Boolean(page.noindex),
  }
}
