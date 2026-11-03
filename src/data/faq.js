// Main-page FAQ. Rendered as visible Q&A and, from the same data, as FAQPage
// JSON-LD — search engines require the markup to match what's on the page.
// Every answer restates something the site already claims; don't add new
// product facts here without checking them.
export const FAQ = [
  {
    q: '하임덱스(HEIMDEX)는 어떤 서비스인가요?',
    qEn: 'What is HEIMDEX?',
    a: '하임덱스는 쌓여 있는 영상 아카이브에서 원하는 장면을 말하듯 검색해 찾고(Scene Intelligence), 무단 유통을 감지하고(Rights Monitor), 찾은 장면을 숏폼·하이라이트로 자동 재편집하는(Auto Recut) AI 영상 검색 솔루션입니다.',
    aEn: 'HEIMDEX is an AI video search solution: search your video archive for any scene the way you’d describe it (Scene Intelligence), detect unauthorized distribution (Rights Monitor), and automatically re-cut what you find into shorts and highlights (Auto Recut).',
  },
  {
    q: '영상을 외부 서버나 클라우드에 업로드해야 하나요?',
    qEn: 'Do I have to upload my video to an outside server or cloud?',
    a: '아니요. 원본 영상은 NAS·서버·PC 등 원래 저장소에 그대로 두고, 검색에 필요한 인덱스만 로컬에서 만듭니다. 대용량 영상을 올리는 시간도, 외부 유출 걱정도 없습니다.',
    aEn: 'No. Your source video stays where it is — NAS, servers, PCs — and only the search index is built locally. No time spent uploading large files, and no leak risk.',
  },
  {
    q: '온프레미스나 폐쇄망 환경에서도 사용할 수 있나요?',
    qEn: 'Does it work on-premise or in an air-gapped network?',
    a: '네. 하임덱스는 온프레미스와 폐쇄망 구동을 지원해, 증거 영상이나 미공개 콘텐츠처럼 민감한 영상이 회사 밖으로 나가지 않습니다.',
    aEn: 'Yes. Heimdex supports on-premise and air-gapped deployment, so sensitive footage such as evidence or unreleased content never leaves the company.',
  },
  {
    q: '어떤 업종에서 사용하나요?',
    qEn: 'Which industries use it?',
    a: '라이브커머스, 미디어·엔터테인먼트, 교육·에듀테크, 로펌·수사, 데이터·연구 등 대량의 영상을 다루는 5개 산업에 맞춘 기능을 제공합니다.',
    aEn: 'It offers features tailored to five video-heavy industries: live commerce, media & entertainment, education & edtech, legal & investigation, and data & research.',
  },
  {
    q: '영상 속 개인정보는 어떻게 보호하나요?',
    qEn: 'How is personal information in video protected?',
    a: '제3자의 얼굴, 차량 번호판 등 민감한 개인정보를 AI가 자동으로 인식해 블러(모자이크) 처리합니다.',
    aEn: 'AI automatically detects sensitive details such as third-party faces and license plates and blurs them.',
  },
  {
    q: '도입 전에 먼저 써 볼 수 있나요?',
    qEn: 'Can we try it before adopting it?',
    a: '네. 무료 1달 PoC로 우리 회사 영상 데이터에서 먼저 검증해 볼 수 있습니다. 도입 문의를 남겨 주시면 안내해 드립니다.',
    aEn: 'Yes. A free 1-month PoC lets you validate it on your own footage first. Leave an inquiry and we’ll walk you through it.',
  },
  {
    q: '개인 크리에이터도 사용할 수 있나요?',
    qEn: 'Can individual creators use it?',
    a: '개인 크리에이터를 위한 하임로그(HEIMLOG by HEIMDEX)가 있습니다. 직접 찍은 여행·일상 영상을 올리면 AI가 장면을 골라 자막·블러까지 넣어 브이로그로 자동 편집해 줍니다.',
    aEn: 'Yes — heimlog (HEIMLOG by HEIMDEX) is built for individual creators. Upload your travel and everyday clips and AI picks the scenes and adds captions and blur to edit them into a vlog.',
  },
]
