// Industry pages (homepage-wireframe 03-1 ~ 03-5). Order is the 1st-priority
// market order from the PPT — the GNB menu, main cards, testimonial slides and
// the "other industries" chips all follow it.
//
// Copy is the PPT slide copy carried by the wireframe. `demoTab` is the tab of
// the existing /product interactive demo that is closest to the industry; it
// backs the "데모 영상 보기" button until real demo videos exist.

export const INDUSTRIES = [
  {
    slug: 'commerce',
    tag: 'For Commerce',
    name: '라이브커머스',
    nameEn: 'Live Commerce',
    menuCaption: '가장 잘 팔린 순간을 숏폼으로',
    menuCaptionEn: 'Your best-selling moments, as short-form',
    // Main-page card copy
    card: ['가장 잘 팔린 순간을', '숏폼으로'],
    cardEn: ['Your best-selling moments,', 'as short-form'],
    headline: ['방송 끝나기 전,', '가장 잘 팔린 순간이', '숏폼으로 나갑니다'],
    headlineEn: ['Before the broadcast ends,', 'your best-selling moment', 'is already out as a short'],
    closing: ['매출로 이어지는 순간을', '가장 빠르게'],
    closingEn: ['The moments that drive sales,', 'out the fastest'],
    image: '/assets/creative/mkt-scene-10.jpg',
    imagePos: 'center 30%',
    demoTab: 'creative',
    features: [
      {
        title: '커머스 특화 AI 모델',
        titleEn: 'Commerce-tuned AI model',
        desc: '구매 전환이 일어나는 순간으로 숏폼을 생성하고, 시연·프로모션 등 방송 구조에 맞춰 장면을 자동 분류합니다.',
        descEn: 'Builds short-form from the moments that convert, and sorts scenes by broadcast structure — demos, promotions and more.',
        img: '/assets/creative/mkt-scene-2.jpg',
        pos: 'center 25%',
      },
      {
        title: '상품 지정 숏폼 생성',
        titleEn: 'Product-specific short-form',
        desc: '원하는 상품·발화만 선택해 숏폼 생성 가능합니다. 엉뚱한 컷을 걸러내는 수작업이 사라집니다.',
        descEn: 'Pick just the product or line you want and get a short. No more manually weeding out stray cuts.',
        img: '/assets/creative/mkt-scene-3.jpg',
        pos: 'center 40%',
      },
      {
        title: '인물 자동 분류',
        titleEn: 'Automatic people sorting',
        desc: '출연자를 AI가 자동 분류하고, 활용이 어려운 특정 인물은 제외해\n재가공 할 수 있습니다.',
        descEn: 'AI sorts the people on screen, so you can leave out anyone you can’t use and re-cut the rest.',
        img: '/assets/creative/mkt-scene-6.jpg',
        pos: 'center 20%',
      },
      {
        title: '내부 레퍼런스 검색',
        titleEn: 'Internal reference search',
        desc: '컨셉·연출·제품을 말하듯 검색하면 내부 아카이브에서 최적의 레퍼런스 구간을 바로 찾아줍니다.',
        descEn: 'Describe a concept, a shot or a product, and the best reference clip in your archive comes right up.',
        img: '/assets/creative/mkt-extra-1.jpg',
        pos: 'center 30%',
      },
    ],
  },
  {
    slug: 'media',
    tag: 'For Creative',
    name: '미디어 · 엔터',
    nameEn: 'Media & Entertainment',
    menuCaption: '검색 한 줄로 입덕 콘텐츠까지',
    menuCaptionEn: 'From one search to fan-favorite content',
    card: ['검색 한 줄로', '입덕 콘텐츠까지'],
    cardEn: ['From one search', 'to fan-favorite content'],
    headline: ['하드 속 미공개 아카이브가', '역주행을 일으킵니다.'],
    headlineEn: ['Unreleased footage on your drives', 'starts climbing the charts.'],
    closing: ['놓친 장면 없이', '다시 태어나는 아카이브'],
    closingEn: ['Not a scene missed —', 'your archive, reborn'],
    image: '/assets/stage/stage-6.jpg',
    imagePos: 'center 40%',
    demoTab: 'creative',
    features: [
      {
        title: '말하듯이 원하는 장면 검색',
        titleEn: 'Search scenes the way you talk',
        desc: '입덕 포인트도, 밈이 될 장면도 말하는 대로 찾습니다. 수십 시간 촬영본을 돌려볼 필요 없습니다.',
        descEn: 'Fan-favorite moments and meme-worthy scenes, found as you describe them. No scrubbing through dozens of hours.',
        img: '/assets/stage/stage-10.jpg',
        pos: 'center 40%',
      },
      {
        title: '하이라이트 + 인물 자동 추출',
        titleEn: 'Highlights + people, extracted',
        desc: '터질 만한 순간을 후보로 제안하고 멤버별 구간까지 자동으로 뽑아주니 담당자는 고르기만 하면 됩니다.',
        descEn: 'Suggests the moments likely to take off and cuts per-member segments, so your team just picks.',
        img: '/assets/stage/stage-11.jpg',
        pos: 'center 30%',
      },
      {
        title: '온프레미스 구조, 유출 리스크 제로',
        titleEn: 'On-premise, zero leak risk',
        desc: '컴백 전 소스도, 미공개 영상도 회사 밖으로 나가지 않습니다.',
        descEn: 'Pre-comeback sources and unreleased footage never leave the building.',
        img: '/assets/stage/stage-15.jpg',
        pos: 'center 50%',
      },
      {
        title: '자동 블러 및 콘텐츠 심의',
        titleEn: 'Auto blur & content review',
        desc: '팬·행인 얼굴 등 개인정보는 자동으로 인식해 블러 처리하고, 선정적·폭력적인 장면은 자동으로 감지해 미리 알려드립니다.',
        descEn: 'Faces of fans and passers-by are detected and blurred automatically, and explicit or violent scenes are flagged in advance.',
        img: '/assets/stage/stage-8.jpg',
        pos: 'center 40%',
      },
    ],
  },
  {
    slug: 'education',
    tag: 'For Education',
    name: '교육 · 에듀테크',
    nameEn: 'Education & EdTech',
    menuCaption: '유저는 더 오래, 강의는 더 멀리',
    menuCaptionEn: 'Learners stay longer, lectures go further',
    card: ['유저는 더 오래,', '강의는 더 멀리'],
    cardEn: ['Learners stay longer,', 'lectures go further'],
    headline: ['잠들어 있던 영상을 깨워', '전 세계로 확장합니다.'],
    headlineEn: ['Wake up dormant lectures', 'and take them worldwide.'],
    closing: ['기존 강의 자산을', '어디서든 다시 쓸 수 있도록'],
    closingEn: ['Your existing lectures,', 'reusable anywhere'],
    image: null, // no lecture footage yet — drawn as a lecture mock (wireframe: "강의 영상 이미지로 교체")
    demoTab: 'research',
    features: [
      {
        title: '전문가 답변 포털로',
        titleEn: 'An expert answer portal',
        desc: '실제 검증된 수업 장면으로 정확하게 답변합니다. 방대한 강의 자산이 곧 질문의 답이 됩니다.',
        descEn: 'Answers come straight from verified class footage. Your lecture library becomes the answer to every question.',
        icon: 'answer',
      },
      {
        title: '챕터별 자동 요약',
        titleEn: 'Chapter-by-chapter summaries',
        desc: '긴 강의를 개념 단위로 자동 요약해 핵심 내용을 텍스트로 바로 제공합니다.',
        descEn: 'Long lectures are summarized concept by concept, with the key points delivered as text.',
        icon: 'chapters',
      },
      {
        title: '다국어 커리큘럼 매칭',
        titleEn: 'Multilingual curriculum matching',
        desc: '언어 무관하게 검색 가능한 형태로 인덱싱해, 기존 자산 그대로 해외 커리큘럼에 맞춰 재구성할 수 있습니다.',
        descEn: 'Indexed to be searchable in any language, so existing material can be rebuilt for curricula abroad as-is.',
        icon: 'languages',
      },
      {
        title: '핵심 구간 자동 추출',
        titleEn: 'Key segments, auto-extracted',
        desc: '교사에게는 회고·연수 자료로, 학생에게는 맞춤 복습 클립으로, 담당자에게는 홍보 소스로 자동 추출됩니다.',
        descEn: 'Pulled out automatically — review material for teachers, tailored recap clips for students, promo sources for staff.',
        icon: 'clips',
      },
    ],
  },
  {
    slug: 'legal',
    tag: 'For Legal',
    name: '로펌 · 수사',
    nameEn: 'Legal & Investigation',
    menuCaption: '방대한 증거 속 결정적 단서만',
    menuCaptionEn: 'Only the decisive clue in vast evidence',
    card: ['방대한 증거 속', '결정적 단서만'],
    cardEn: ['Only the decisive clue', 'in vast evidence'],
    headline: ['방대한 증거 속', '결정적 단서만'],
    headlineEn: ['Only the decisive clue', 'in vast evidence'],
    closing: ['방대한 기록 속', '결정적 순간을 정확히'],
    closingEn: ['In vast records,', 'the decisive moment, precisely'],
    image: '/assets/dashcam/dashcam-6.jpg',
    imagePos: 'center 50%',
    demoTab: 'legal',
    features: [
      {
        title: '사건 기록 요약 및 타임라인 확인',
        titleEn: 'Case summaries & timelines',
        desc: '심문 영상, CCTV 영상 등 방대한 사건 기록을 요약하고, 원하는 장면만 타임라인으로 바로 확인 가능합니다.',
        descEn: 'Summarizes vast case records like interrogation and CCTV footage, and puts just the scenes you need on a timeline.',
        img: '/assets/dashcam/dashcam-2.jpg',
        pos: 'center 50%',
      },
      {
        title: '행동 맥락 분석',
        titleEn: 'Behavioral context analysis',
        desc: '단순한 사람·사물 식별을 넘어, 정황과 맥락까지 정밀히 분석하여 신뢰도 높은 정황 증거의 기반을 마련해 드립니다.',
        descEn: 'Goes beyond spotting people and objects to analyze circumstances and context — a solid basis for circumstantial evidence.',
        img: '/assets/dashcam/dashcam-4.jpg',
        pos: 'center 50%',
      },
      {
        title: '유출 리스크 없이 완벽한 보안',
        titleEn: 'Airtight security, no leak risk',
        desc: '폐쇄형 로컬 방식으로 민감한 증거 영상이 외부에 절대 노출되지 않습니다.',
        descEn: 'Runs closed and local, so sensitive evidence footage is never exposed outside.',
        img: '/assets/hero-legal.jpg',
        pos: 'center 40%',
      },
      {
        title: '개인정보 자동 블러',
        titleEn: 'Automatic privacy blur',
        desc: '제3자의 얼굴, 차량 번호판 등 민감한 개인정보를 AI가 자동으로 인식해 블러(모자이크) 처리합니다.',
        descEn: 'AI detects third-party faces, license plates and other sensitive details and blurs them automatically.',
        img: '/assets/dashcam/dashcam-8.jpg',
        pos: 'center 50%',
      },
    ],
  },
  {
    slug: 'research',
    tag: 'For Research',
    name: '데이터 · 연구',
    nameEn: 'Data & Research',
    menuCaption: '인사이트를 더 빠르고 정확하게',
    menuCaptionEn: 'Insights, faster and more precise',
    card: ['인사이트를', '더 빠르고 정확하게'],
    cardEn: ['Insights,', 'faster and more precise'],
    headline: ['인사이트를', '더 빠르고 정확하게'],
    headlineEn: ['Insights,', 'faster and more precise'],
    closing: ['오차 없는 데이터로', '신뢰할 수 있는 결과'],
    closingEn: ['Error-free data,', 'results you can trust'],
    image: '/assets/research/research-vid-1.jpg',
    imagePos: 'center 50%',
    demoTab: 'research',
    features: [
      {
        title: '데이터 텍스트화 및 보고서 초안 지원',
        titleEn: 'Video to text, with report drafts',
        desc: '영상 전체를 텍스트로, 구간별 핵심을 요약본으로 제공하여 논문 및 보고서 초안이 빨라집니다.',
        descEn: 'Turns whole videos into text and segments into summaries, so papers and report drafts come together faster.',
        img: '/assets/research/research-vid-6.jpg',
        pos: 'center 40%',
      },
      {
        title: '휴먼 에러 제로 — 연구 데이터 무결성 확보',
        titleEn: 'Zero human error — data integrity',
        desc: '사람이 놓칠 수 있는 장면까지 정확히 포착하여 연구의 객관성과 신뢰도를 극대화하세요.',
        descEn: 'Captures even the scenes people miss, maximizing the objectivity and reliability of your research.',
        img: '/assets/research/research-2.jpg',
        pos: 'center 50%',
      },
      {
        title: '폐쇄망 기반 보안 유출 차단',
        titleEn: 'Closed-network leak protection',
        desc: '기관 내부 폐쇄망 환경에서만 구동되므로, 기술 유출이나 사내 보안 규정 위반으로부터 100% 안전합니다.',
        descEn: 'Runs only inside your institution’s closed network — fully safe from tech leaks and internal security violations.',
        img: '/assets/research/research-vid-4.jpg',
        pos: 'center 50%',
      },
      {
        title: 'IRB · 개인정보보호법 대응 자동화',
        titleEn: 'IRB & privacy-law compliance, automated',
        desc: '피험자나 임상시험 참여자의 영상 데이터 제출 시 필수적인 개인정보 블러 작업을 자동화합니다.',
        descEn: 'Automates the privacy blurring required when submitting video of research subjects or trial participants.',
        img: '/assets/research/research-vid-7.jpg',
        pos: 'center 40%',
      },
    ],
  },
]

export const industryPath = (slug) => `/product/business/industry/${slug}`

export const findIndustry = (slug) => INDUSTRIES.find((i) => i.slug === slug)

// Business product features (wireframe 01-1 / 02 S4). Descriptions are the
// wireframe's temporary copy — marked "확정 필요" there.
export const FEATURES = [
  {
    slug: 'scene-intelligence',
    name: 'Scene Intelligence',
    kind: '장면 검색',
    kindEn: 'Scene search',
    menu: '말하듯 검색해 원하는 장면을 바로 찾기',
    menuEn: 'Find any scene just by describing it',
    desc: '말하듯 입력하면 수십 시간 영상 속에서 원하는 장면을 바로 찾아요.\n인물·행동·맥락까지 검색돼요.',
    descEn: 'Type it the way you’d say it and find the scene in hours of footage — by person, action, even context.',
  },
  {
    slug: 'rights-monitor',
    name: 'Rights Monitor',
    kind: '유통 보호',
    kindEn: 'Distribution protection',
    menu: '내 영상의 무단 유통을 감지하고 보호하기',
    menuEn: 'Detect and stop unauthorized use of your video',
    desc: '내 영상이 어디서 무단으로 쓰이는지 감지하고 알려드려요.',
    descEn: 'Detects where your video is being used without permission, and tells you.',
  },
  {
    slug: 'auto-recut',
    name: 'Auto Recut',
    kind: '자동 재편집',
    kindEn: 'Automatic re-editing',
    menu: '찾은 장면을 숏폼 · 하이라이트로 자동 재편집',
    menuEn: 'Re-cut found scenes into shorts and highlights',
    desc: '찾은 장면을 숏폼 · 하이라이트 · 리포트로 자동으로 다시 만들어요.',
    descEn: 'Automatically remakes the scenes you find into shorts, highlights and reports.',
  },
]

export const featurePath = (slug) => `/product/business/${slug}`

// Shared outbound URLs (wireframe 00 ⑤ URL 구조).
export const HEIMLOG_APP = 'https://heimlog.heimdex.co/'
// Creators content lives on the heimlog site; the rest on blog.heimdex.co.
export const blogUrl = (collection, lang) =>
  collection === 'creators' ? 'https://heimlog.heimdex.co/blog' : `https://blog.heimdex.co/${lang === 'en' ? 'en' : 'ko'}/${collection}/`
