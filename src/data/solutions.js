// Verbatim copy for the three solution tabs, extracted from the Figma file.
// Each page shares the same template; only the text differs.

export const TABS = [
  { id: 'legal', label: 'for Legal' },
  { id: 'creative', label: 'for Creative' },
  { id: 'research', label: 'for Research' },
]

export const SOLUTIONS = {
  legal: {
    label: 'for Legal',
    title: ['법률 · 수사'],
    subtitle: '밤새워 보던 수백 시간의 CCTV, 1분 만에 스캔합니다.',
    // Placeholder for the upcoming product demo (image slides / video).
    media: [
      { step: '01', label: '장면 요약 · 스크립트' },
      { step: '02', label: '장면 분석 · 검색' },
      { step: '03', label: '클립 추출 · 증거 리포트 변환' },
    ],
    reasonsTitle: '결정적인 증거를 찾는\n가장 빠른 지름길, 하임덱스',
    reasonsList: [
      {
        title: '영상 검토는 AI가,\n변론과 수사는 당신이',
        desc: '심문 영상, CCTV 영상 등 방대한 사건 기록을 요약하고, 원하는 장면만 타임라인으로 바로 확인 가능합니다.',
      },
      {
        title: '조서 작성부터 법원 제출용\n증거 클립까지',
        desc: '영상 속 모든 대화를 녹취록으로 변환하고, 핵심 증거 구간만 클립으로 추출해 즉시 활용 가능합니다.',
      },
      {
        title: '단순 인식을 넘어 행동의\n실마리를 분석',
        desc: '단순한 사람·사물 식별을 넘어, 정황과 맥락까지 정밀히 분석하여 신뢰도 높은 정황 증거의 기반을 마련해 드립니다.',
      },
      {
        title: '개인정보 보호와 심의 준비도 단 1초 만에',
        desc: '제3자의 얼굴, 차량 번호판 등 민감한 개인정보를 AI가 자동으로 인식해 블러(모자이크) 처리합니다.',
      },
      {
        title: '단 1Byte도 외부 유출 불가, 완벽한 보안',
        desc: '폐쇄형 로컬 방식으로 민감한 증거 영상이 외부에 절대 노출되지 않습니다.',
      },
    ],
    faq: [
      {
        q: '증거 영상 파일을 모두 특정 서버에 업로드해야 하나요?',
        a: '아니요. 폐쇄형 로컬 방식으로 운영되어 영상이 외부 서버에 업로드되거나 저장되지 않습니다. 증거 영상의 보안을 완벽하게 유지합니다.',
      },
      {
        q: '어떤 형식의 영상 파일을 지원하나요?',
        a: 'MP4, AVI, MOV 등 주요 영상 포맷을 모두 지원합니다. CCTV 전용 포맷도 별도 변환 없이 바로 분석 가능합니다.',
      },
      {
        q: '장면 검색은 얼마나 정확한가요?',
        a: '단순 사물·인물 식별을 넘어 구체적인 행동, 상황, 맥락까지 정확히 분석합니다. 필요한 장면을 말하듯이 검색하면 수천 시간의 영상에서 결정적인 장면을 찾아냅니다.',
      },
      {
        q: '법원 제출용 자료로 바로 사용할 수 있나요?',
        a: '필요한 장면만 추출해 클립으로 제작하거나 전체 발언을 자동 녹취록으로 변환합니다. 법원 제출용 증거 자료로 바로 활용 가능합니다.',
      },
      {
        q: '블러 처리는 자동으로 되나요?',
        a: '네. 피해자, 미성년자, 차량 번호판 등 민감 정보를 AI가 자동으로 감지해 블러 처리합니다. 수동 작업 없이 개인정보보호 기준을 충족합니다.',
      },
    ],
    cta: {
      title: '방대한 영상 증거에서\n필요한 단서만 꺼내 쓰세요',
      highlight: '한 달 무료 체험',
      rest: '으로 결정적 증거를 얼마나 빨리 찾는지 확인해보세요.',
    },
  },

  creative: {
    label: 'for Creative',
    title: ['마케터 · PD'],
    subtitle: '클릭 한 번으로 숏폼 완성, 이제 기획에만 집중하세요.',
    media: [
      { step: '01', label: '반자동·자동 숏폼' },
      { step: '02', label: '장면 검색' },
      { step: '03', label: '장면 요약·스크립트' },
    ],
    reasonsTitle: '크리에이티브를 위한\n최적의 선택, 하임덱스',
    reasonsList: [
      {
        title: '수백 기가 촬영본도\n구글링하듯 1초 만에 검색',
        desc: '원본 영상을 돌려볼 필요 없이 대사, 인물, 행동 등 말하듯 검색하면 정확한 타임라인을 찾아냅니다.',
      },
      {
        title: '클릭 한 번으로 뽑아내는\n바이럴 숏폼 마스터',
        desc: '선택한 소스로 나만의 숏폼을, 또는 AI가 알아서 뚝딱 완성합니다. 남들보다 한발 앞서 바이럴을 선점하세요.',
      },
      {
        title: '무거운 영상 이동 제로,\n연결하는 순간 검색 시작',
        desc: '무거운 영상을 옮길 필요 없어요. AI가 제자리에서 분석하고 인덱싱합니다.',
      },
      {
        title: '쓰던 툴 그대로,\n프리미어 프로 완벽 연동',
        desc: '프리미어 프로와 바로 연동됩니다. 지금 하던 방식 그대로 편집하세요.',
      },
      {
        title: '미공개 런칭 영상,\n엠바고 소스도 유출 걱정 제로',
        desc: '소중한 크리에이티브 자산이 외부에 노출될 리스크를 원천 차단합니다.',
      },
    ],
    faq: [
      {
        q: '영상을 하임덱스 플랫폼에 업로드해야 검색이 되나요?',
        a: '아니요. 클라우드, 외장하드, 사내 서버 등 기존 구축 방식 그대로 사용하시면 됩니다. 따로 파일을 옮길 필요 없습니다.',
      },
      {
        q: '숏폼 제작 시 편집 수준을 조절할 수 있나요?',
        a: '네. 원하는 컷을 직접 선택하는 반자동 방식과 특정 상품을 셀렉트해서 강조한 숏폼을 만들어주는 자동 방식 중 선택 가능합니다.',
      },
      {
        q: '프리미어 프로 말고 다른 편집 툴도 연동되나요?',
        a: '현재 프리미어 프로 연동을 지원하며 추가 편집 툴 연동은 순차적으로 업데이트 예정입니다. 도입 문의 시 필요한 툴을 말씀해주시면 우선 검토해드립니다.',
      },
      {
        q: '특정 제품이나 브랜드를 강조한 숏폼도 자동으로 만들 수 있나요?',
        a: '네. 강조하고 싶은 제품을 지정하면 AI가 관련 장면을 자동으로 선별해 숏폼을 제작합니다. 별도 편집 없이 바로 활용 가능합니다.',
      },
      {
        q: '한 번에 몇 개의 숏폼을 만들 수 있나요?',
        a: '제한 없이 여러 개를 동시에 제작할 수 있습니다. 하나의 원본 영상에서 다양한 컷과 주제로 구성된 숏폼을 한 번에 뽑아낼 수 있습니다.',
      },
    ],
    cta: {
      title: '단순 반복 편집 업무가 아닌\n기획·전략·연출에 집중하세요',
    },
  },

  research: {
    label: 'for Research',
    title: ['연구 · 데이터'],
    subtitle: '단 1초의 오류도 없이, 수백 시간의 실험 데이터를 완벽 검증합니다.',
    media: [
      { step: '01', label: '실험 영상 검색' },
      { step: '02', label: '장면 요약·스크립트' },
      { step: '03', label: '개인정보 블러' },
    ],
    reasonsTitle: '연구 데이터의 신뢰성을 높이는\n완벽 솔루션, 하임덱스',
    reasonsList: [
      {
        title: '단순 키워드로 포착하는\n실험 내 특정 행동 및 변수',
        desc: '연구원이 관찰하고자 하는 현상의 전후 맥락을 자연어로 입력하면 타임라인을 정확히 찾아냅니다.',
      },
      {
        title: '데이터 텍스트화부터\n연구 보고서 초안 작성까지',
        desc: '영상 전체를 텍스트로, 구간별 핵심을 요약본으로 제공하여 논문 및 보고서 초안이 빨라집니다.',
      },
      {
        title: '휴먼 에러 제로,\n연구 데이터의 무결성 확보',
        desc: '사람이 놓칠 수 있는 장면까지 정확히 포착하여 연구의 객관성과 신뢰도를 극대화하세요.',
      },
      {
        title: '미공개 연구 자산 등\n보안 유출 원천 차단',
        desc: '기관 내부 폐쇄망 환경에서만 구동되므로, 기술 유출이나 사내 보안 규정 위반으로부터 100% 안전합니다.',
      },
      {
        title: '까다로운 IRB 윤리 기준과\n개인정보보호법 완벽 대응',
        desc: '피험자나 임상시험 참여자의 영상 데이터 제출 시 필수적인 개인정보 블러 작업을 자동화합니다.',
      },
    ],
    faq: [
      {
        q: '연구 영상 데이터가 외부에 유출될 위험은 없나요?',
        a: '없습니다. 폐쇄형 로컬 방식으로 운영되어 미공개 실험 영상, 임상 데이터 등 민감한 연구 자료가 외부에 절대 노출되지 않습니다.',
      },
      {
        q: '연구 참여자의 개인정보 보호는 어떻게 처리되나요?',
        a: '연구 참여자 얼굴, 개인 식별 정보를 AI가 자동으로 감지해 블러 처리합니다. IRB 윤리 기준과 개인정보보호법을 별도 작업 없이 충족할 수 있습니다.',
      },
      {
        q: '외국어로 진행된 강연·세미나 영상도 스크립트 변환이 되나요?',
        a: '네. 다국어 영상의 스크립트 변환을 지원합니다. 지원 언어 목록은 도입 문의 시 상세히 안내 드립니다.',
      },
      {
        q: '실험 영상이 수백 시간 분량인데 분석 속도가 느리지 않나요?',
        a: 'AI가 영상 전체를 검색하기 좋은 색인 형태로 저장해두기 때문에 대용량 영상도 빠르게 처리합니다. 처음부터 재생하며 확인하는 시간을 대폭 줄여드립니다.',
      },
      {
        q: '스크립트 변환 결과물을 바로 논문·보고서에 활용할 수 있나요?',
        a: '네. 자동 변환된 스크립트는 텍스트 파일로 즉시 내보낼 수 있습니다. 핵심 내용 요약본도 함께 제공되어 논문·보고서 작성 시간을 크게 단축합니다.',
      },
    ],
    cta: {
      title: '연구 영상의 인사이트를\n더 빠르고 정확하게 분석해보세요',
    },
  },
}

// English mirror of SOLUTIONS — same shape, swapped wholesale by language.
export const SOLUTIONS_EN = {
  legal: {
    label: 'for Legal',
    title: ['Legal & Investigation'],
    subtitle: 'Scan hundreds of hours of CCTV you used to review overnight — in a single minute.',
    media: [
      { step: '01', label: 'Scene Summary · Script' },
      { step: '02', label: 'Scene Analysis · Search' },
      { step: '03', label: 'Clip Extraction · Evidence Report' },
    ],
    reasonsTitle: 'The fastest shortcut to the\ndecisive evidence — Heimdex',
    reasonsList: [
      {
        title: 'Let AI review the footage,\nyou focus on the defense',
        desc: 'Summarize vast case records — interrogation and CCTV footage — and jump straight to any scene on the timeline.',
      },
      {
        title: 'From drafting records to\ncourt-ready evidence clips',
        desc: 'Convert every conversation in the video into a transcript, and extract only the key evidence segments as clips, ready to use instantly.',
      },
      {
        title: 'Beyond simple recognition —\nanalyzing the clues in behavior',
        desc: 'Going beyond identifying people and objects, it precisely analyzes context and circumstance to build a foundation for credible circumstantial evidence.',
      },
      {
        title: 'Privacy protection and review prep\nin a single second',
        desc: 'AI automatically detects and blurs (mosaics) sensitive personal data such as third-party faces and license plates.',
      },
      {
        title: 'Not a single byte leaves —\nairtight security',
        desc: 'A closed, local-only approach ensures sensitive evidence videos are never exposed externally.',
      },
    ],
    faq: [
      {
        q: 'Do I have to upload all evidence videos to a specific server?',
        a: 'No. It runs in a closed, local environment, so videos are never uploaded to or stored on an external server. The security of your evidence is fully preserved.',
      },
      {
        q: 'Which video file formats are supported?',
        a: 'It supports all major video formats such as MP4, AVI, and MOV. CCTV-specific formats can also be analyzed directly without separate conversion.',
      },
      {
        q: 'How accurate is scene search?',
        a: 'Beyond simple object and person recognition, it accurately analyzes specific actions, situations, and context. Search as if speaking, and it finds the decisive scene across thousands of hours of footage.',
      },
      {
        q: 'Can I use the results directly as court-ready materials?',
        a: 'You can extract only the scenes you need as clips or auto-convert full statements into transcripts — ready to use directly as court-submission evidence.',
      },
      {
        q: 'Is blurring done automatically?',
        a: 'Yes. AI automatically detects and blurs sensitive information such as victims, minors, and license plates — meeting privacy-protection standards with no manual work.',
      },
    ],
    cta: {
      title: 'From vast video evidence,\npull out only the clue you need',
    },
  },

  creative: {
    label: 'for Creative',
    title: ['Marketers & Producers'],
    subtitle: 'Finish a short-form in one click — now focus only on the ideas.',
    media: [
      { step: '01', label: 'Semi-auto · Auto Short-form' },
      { step: '02', label: 'Scene Search' },
      { step: '03', label: 'Scene Summary · Script' },
    ],
    reasonsTitle: 'The optimal choice for\ncreatives — Heimdex',
    reasonsList: [
      {
        title: 'Search hundreds of gigs of footage\nin a second, like a Google search',
        desc: 'No need to scrub through the original — search by dialogue, people, or action as if speaking, and find the exact timeline.',
      },
      {
        title: 'A viral short-form master\nin a single click',
        desc: 'Build your own short-form from selected sources, or let AI finish it for you. Stay one step ahead and claim the next viral hit.',
      },
      {
        title: 'Zero heavy file transfers —\nsearch the moment you connect',
        desc: 'No need to move heavy videos. AI analyzes and indexes them right where they are.',
      },
      {
        title: 'Keep your tools —\nseamless Premiere Pro integration',
        desc: 'It integrates directly with Premiere Pro. Keep editing exactly the way you do now.',
      },
      {
        title: 'Unreleased launch videos and\nembargoed sources — zero leak worries',
        desc: 'It fundamentally blocks any risk of your valuable creative assets being exposed externally.',
      },
    ],
    faq: [
      {
        q: 'Do I have to upload videos to the Heimdex platform for search to work?',
        a: 'No. You can keep using your existing setup — cloud, external drives, in-house servers — exactly as is. There’s no need to move files.',
      },
      {
        q: 'Can I adjust the level of editing when creating short-form?',
        a: 'Yes. You can choose between a semi-automatic mode where you select the cuts yourself, and an automatic mode that builds short-form highlighting a selected product.',
      },
      {
        q: 'Does it integrate with editing tools other than Premiere Pro?',
        a: 'It currently supports Premiere Pro integration, with additional tool integrations rolling out over time. Let us know which tool you need when you reach out, and we’ll prioritize reviewing it.',
      },
      {
        q: 'Can it automatically create short-form highlighting a specific product or brand?',
        a: 'Yes. Specify the product you want to highlight and AI automatically selects the relevant scenes to produce the short-form — ready to use without separate editing.',
      },
      {
        q: 'How many short-form videos can I make at once?',
        a: 'You can produce many at the same time without limit. From a single source video, you can pull out short-form composed of various cuts and themes all at once.',
      },
    ],
    cta: {
      title: 'Not repetitive editing work, but\nideas, strategy, and direction',
    },
  },

  research: {
    label: 'for Research',
    title: ['Data & Research'],
    subtitle: 'Verify hundreds of hours of experiment data flawlessly — without a single second of error.',
    media: [
      { step: '01', label: 'Experiment Video Search' },
      { step: '02', label: 'Scene Summary · Script' },
      { step: '03', label: 'Personal-data Blur' },
    ],
    reasonsTitle: 'The complete solution that raises the\ncredibility of research data — Heimdex',
    reasonsList: [
      {
        title: 'Capture specific behaviors and\nvariables with simple keywords',
        desc: 'Enter the before-and-after context of the phenomenon you want to observe in natural language, and it pinpoints the timeline precisely.',
      },
      {
        title: 'From turning data into text to\ndrafting the research report',
        desc: 'Provide the full footage as text and section-by-section highlights as summaries, accelerating drafts of papers and reports.',
      },
      {
        title: 'Zero human error —\nsecuring the integrity of research data',
        desc: 'It precisely captures even scenes a person might miss, maximizing the objectivity and credibility of your research.',
      },
      {
        title: 'Unreleased research assets —\nleaks blocked at the source',
        desc: 'It runs only within your institution’s closed network, keeping you 100% safe from technology leaks or internal security-policy violations.',
      },
      {
        title: 'Full compliance with strict IRB ethics\nand privacy regulations',
        desc: 'It automates the personal-data blurring required when submitting video data of subjects or clinical-trial participants.',
      },
    ],
    faq: [
      {
        q: 'Is there any risk of research video data leaking externally?',
        a: 'No. It operates in a closed, local environment, so sensitive research materials — unreleased experiment footage, clinical data — are never exposed externally.',
      },
      {
        q: 'How is the privacy of research participants handled?',
        a: 'AI automatically detects and blurs participants’ faces and personally identifiable information. You can meet IRB ethics standards and privacy law with no separate work.',
      },
      {
        q: 'Can scripts be converted for lectures or seminars held in a foreign language?',
        a: 'Yes. It supports script conversion for multilingual video. The list of supported languages is provided in detail when you reach out.',
      },
      {
        q: 'Won’t analysis be slow for experiment videos hundreds of hours long?',
        a: 'Because AI stores the entire video in an index format optimized for search, it processes even large-volume footage quickly — dramatically cutting the time spent reviewing from the start.',
      },
      {
        q: 'Can the script-conversion output be used directly in papers and reports?',
        a: 'Yes. The auto-converted script can be exported instantly as a text file. A summary of key content is also provided, greatly reducing the time to write papers and reports.',
      },
    ],
    cta: {
      title: 'Analyze the insights in your research\nvideos faster and more precisely',
    },
  },
}
