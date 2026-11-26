// Korean collection copy — landing cards, detail pages, carousel. Source:
// "HEIMDEX 데이터 페이지 카피 수정안" (기준: AI 학습 데이터 라이브러리_최종.pptx).
// The old /data/speaker-separated page is merged into multi-speaker.
//
// Card:   name · count · desc · tags · stats
// Detail: descLines · detailTags · delivery (파일/묶음/전달) · spec · specNote · customBand
// Elsewhere (carousel, mega-menu, meta): carouselDesc

const DELIVERY = (file, bundle) => [
  { label: '파일', value: file },
  { label: '묶음', value: bundle },
  { label: '전달', value: '클라우드 · 외장 드라이브' },
]
const CAMERA_HOURS = '카메라 시간 = 카메라 1대가 1시간 찍은 분량을 모두 더한 값, 실촬영 시간 = 같은 순간을 한 번만 센 시간이에요.'
const CUSTOM = (body) => ({ title: '조금 다른 조건이 필요하세요?', body, button: '이 데이터 기준으로 맞춤 요청' })

export const KO_COLLECTIONS = [
  {
    slug: 'multi-speaker',
    icon: 'icon-users.svg',
    name: '다화자 대화',
    count: '6종',
    desc: '출연자별로 따로 녹음한 실제 대화예요.\n말 겹침, 맞장구, 웃음까지 그대로 담겨있어요.',
    carouselDesc: '출연자마다 따로 녹음한, 대본 없는 실제 대화예요.',
    tags: ['풀듀플렉스 대화', 'ASR·화자 분리', '다화자 TTS'],
    stats: [
      { value: '14,800h+', label: '대화 시간' },
      { value: '2인 이상', label: '세션당 화자' },
    ],
    descLines: [
      '2인 이상이 나누는 대본 없는 실제 대화예요. 화자마다 마이크 트랙이 따로 있어요.',
      '오버랩·백채널·턴테이킹이 그대로 살아 있고, 같은 타임코드의 멀티캠 영상도 함께 받을 수 있어요.',
    ],
    detailTags: ['풀듀플렉스 대화', '음성 인식 · 화자 분리', '다화자 TTS', '립싱크 · 화자 귀속'],
    delivery: DELIVERY('화자별 WAV + 현장 믹스 (선택: 영상)', '편집 전 연속 세션'),
    spec: [
      { label: '총 분량', value: '14,800시간 (대화 시간) · 세션 약 11,930개 · 화자 약 5,750명' },
      { label: '언어', value: '한국어 8,900시간 · 영어 2,900시간 · 일본어 1,800시간 · 중국어 1,200시간' },
      { label: '화자 구성', value: '2인 이상 (세션당 2~9명)' },
      { label: '장르', value: '토크쇼 · 팟캐스트 · 1:1 인터뷰 · 스튜디오 예능 · 아이돌 자체 콘텐츠 · 리얼리티·관찰 예능' },
      { label: '오디오', value: '화자별 마이크 트랙 48kHz/24bit WAV + 현장 믹스 트랙' },
      { label: '대화 특성', value: '말 겹침 · 맞장구 · 웃음 · 쉼이 편집 없이 그대로' },
      { label: '영상 (선택)', value: '멀티캠 1080p~4K, 촬영 원본 코덱, 오디오와 같은 타임코드. 스튜디오 예능 · 리얼리티는 전 세션, 그 외 장르는 멀티캠 촬영이 있는 세션만 제공' },
      { label: '라벨 · 기본 제공', value: '화자-마이크 트랙 매핑 (영상 포함 시 샷 경계)' },
      { label: '라벨 · 추가 (유료)', value: '전사 · 정밀 전사 · 대화 이벤트(말 겹침 · 맞장구 · 웃음 · 쉼 · 정정) · 화자 메타데이터 · 개인정보 발화 처리 · 장면 캡션' },
    ],
    specNote: '대화 시간 = 실제 대화가 이어진 시간이에요. 화자 트랙이 여러 개여도 한 번만 셉니다.',
    customBand: CUSTOM('화자 수, 언어, 장르, 영상 포함 여부, 라벨을 바꿔 맞춤으로 요청할 수 있어요.'),
  },
  {
    slug: 'multicam',
    icon: 'icon-video.svg',
    name: '동기화 멀티캠',
    count: '5종',
    desc: '같은 순간을 카메라 4~12대로 동시 촬영한 원본이에요.\n모든 카메라가 타임코드로 맞춰져 있어요.',
    carouselDesc: '같은 순간을 카메라 4~12대로 동시에 찍은 원본이에요.',
    tags: ['멀티뷰 생성', '카메라 제어', '월드 모델'],
    stats: [
      { value: '13,600h+', label: '카메라 시간' },
      { value: '4~12대', label: '장면당 카메라 수' },
    ],
    descLines: [
      '같은 순간을 카메라 4~12대로 동시에 찍은 원본이에요.',
      '모든 카메라가 하나의 타임코드로 싱크돼 있고, 다인원·무빙 카메라·실제 조명 조건이 그대로 담겼어요.',
    ],
    detailTags: ['멀티뷰 생성', '카메라 제어', '월드 모델'],
    delivery: DELIVERY('카메라별 원본 영상', '편집 전 연속 세션'),
    spec: [
      { label: '총 분량', value: '13,600 카메라 시간 · 실촬영 약 2,900시간' },
      { label: '구성', value: '무대 공연 · 스튜디오 예능 · 여행·로케 · 야외 예능 · 라이브커머스 스튜디오 (5종)' },
      { label: '카메라 구성', value: '장면당 4~12대 동시 촬영 (고정 · 핸드헬드 · 드론 · 지미집), 하나의 타임코드로 정렬' },
      { label: '인원', value: '여러 사람이 함께 나오는 장면 (무대 4~9인 그룹, 예능 MC·게스트 2~8인 등)' },
      { label: '영상', value: '1080p~4K (무대 공연 4K 60fps, 스튜디오 4K 30fps), 촬영 원본 코덱 그대로' },
      { label: '화면', value: '자막 · 로고를 입히기 전 깨끗한 원본' },
      { label: '라벨 · 기본 제공', value: '샷 경계' },
      { label: '라벨 · 추가 (유료)', value: '샷 라벨(샷 종류 · 카메라 움직임) · 장면 캡션 · 손·신체 키포인트 · 비식별 처리' },
    ],
    specNote: CAMERA_HOURS,
    customBand: CUSTOM('카메라 수, 장르, 해상도, 라벨을 바꿔 맞춤으로 요청할 수 있어요.'),
  },
  {
    slug: 'broadcast-pair',
    icon: 'feature-film.svg',
    name: '원본·방송본 페어',
    count: '3종',
    desc: '방송에 나간 편집본과 모든 카메라의 원본을 한 쌍으로 드려요.',
    carouselDesc: '방송 편집본과 모든 카메라 원본을 한 쌍으로 드려요.',
    tags: ['자동 편집', '하이라이트·숏폼', '장면 이해'],
    stats: [
      { value: '12,400h+', label: '카메라 시간' },
      { value: 'EDL 포함', label: '음악방송·스튜디오 예능' },
    ],
    descLines: [
      '방송 편집본과 그 장면을 찍은 모든 카메라 원본을 한 쌍으로 드려요.',
      '컷마다 어떤 카메라의 어느 구간을 썼는지(EDL)가 붙어 있고, 미사용 앵글과 NG까지 포함돼요.',
    ],
    detailTags: ['자동 편집', '하이라이트 · 숏폼', '장면 이해'],
    delivery: DELIVERY('카메라별 원본 + 방송 편집본 + 편집 정보', '편집 전 연속 세션'),
    spec: [
      { label: '총 분량', value: '12,400 카메라 시간 · 실촬영 약 4,240시간' },
      {
        label: '구성 (3종)',
        value:
          '음악방송 무대 원본·방송본 4,200시간 (카메라 6~12대, 4K 60fps)\n스튜디오 예능 원본·방송본 5,200시간 (카메라 4~8대, 4K 30fps)\n인서트·풍경 원본 3,000시간 (카메라 1~2대, 1080p~4K, 인물 없는 장소 · 방송 미사용분)',
      },
      { label: '편집 정보', value: '방송 컷마다 쓰인 카메라와 원본의 시작·끝 시점 (EDL) · 음악방송 · 스튜디오 예능에 포함' },
      { label: '동기화', value: '모든 카메라와 방송본을 하나의 타임코드로 정렬, 모든 카메라는 끊김 없이 연속 녹화' },
      { label: '화면', value: '자막 · 로고를 입히기 전 깨끗한 원본, 촬영 원본 코덱 그대로' },
      { label: '라벨 · 기본 제공', value: '샷 경계 · 편집 정보 (EDL)' },
      { label: '라벨 · 추가 (유료)', value: '샷 라벨(샷 종류 · 카메라 움직임) · 장면 캡션 · 비식별 처리' },
    ],
    specNote: CAMERA_HOURS,
    customBand: CUSTOM('장르, 카메라 수, 해상도, 라벨을 바꿔 맞춤으로 요청할 수 있어요.'),
  },
  {
    slug: 'presenter',
    icon: 'feature-hand.svg',
    name: '라이브커머스 제품 시연',
    count: '4종',
    desc: '쇼호스트가 제품을 설명하는 말과 손동작이 함께 담긴 방송 원본이에요.',
    carouselDesc: '제품을 설명하는 말과 손동작이 함께 담긴 방송 원본이에요.',
    tags: ['언어-행동 정렬(VLA)', '물체 조작', '버추얼 쇼호스트'],
    stats: [
      { value: '7,000h+', label: '카메라 시간' },
      { value: '1~2명', label: '쇼호스트' },
    ],
    descLines: [
      '설명하는 말과 손동작이 같은 타임코드에 맞춰진 라이브커머스 원본이에요.',
      '1~3시간 연속 세션이고, 손 클로즈업과 와이드를 동시에 촬영했어요.',
    ],
    detailTags: ['언어-행동 정렬(VLA)', '물체 조작', '버추얼 쇼호스트'],
    delivery: DELIVERY('카메라별 영상 + 진행자 마이크 WAV', '편집 전 연속 세션'),
    spec: [
      { label: '총 분량', value: '7,000 카메라 시간 · 실촬영 약 3,150시간' },
      { label: '구성', value: '쇼호스트 판매 진행 · 시청자 Q&A 라이브 · 상품 시연 클로즈업 · 제품 다각도 촬영 (4종)' },
      { label: '출연자', value: '쇼호스트 · 판매자 · 게스트 1~2명, 전원 AI 학습 동의' },
      { label: '제품 종류', value: '뷰티 · 식품 · 패션 · 생활용품 · 소형 가전' },
      { label: '카메라 구성', value: '1~3대 (손 클로즈업 + 진행자 전체 화면, 제품 360° 턴테이블)' },
      { label: '영상 · 오디오', value: '1080p 30fps~4K, 촬영 원본 코덱 · 진행자 마이크 48kHz/24bit WAV, 같은 타임코드' },
      { label: '라벨 · 기본 제공', value: '샷 경계' },
      { label: '라벨 · 추가 (유료)', value: '행동 구간(동작 시작·끝 · 동작 이름 · 대상 물체 · 사용한 손) · 손·신체 키포인트 · 전사 · 장면 캡션 · 비식별 처리' },
    ],
    customBand: CUSTOM('제품 종류, 카메라 구성, 라벨을 바꿔 맞춤으로 요청할 수 있어요.'),
  },
  {
    slug: 'motion',
    icon: 'icon-person-standing.svg',
    name: '전신 동작',
    desc: '실제 제작 현장의 자연스러운 동작과 상호작용을 휴머노이드 형식으로 변환했어요.',
    carouselDesc: '실제 촬영 현장의 동작을 휴머노이드 형식으로 바꿨어요.',
    tags: ['휴머노이드 제어', '모션 생성'],
    stats: [
      { value: '10,000h+', label: '동작 시간' },
      { value: '자유', label: '로봇 형식' },
    ],
    descLines: [
      '실제 촬영 현장의 자연스러운 동작과 사람 간 상호작용이에요.',
      '휴머노이드 형식으로 리타게팅한 뒤 시뮬레이션 검증까지 마쳤어요.',
    ],
    detailTags: ['휴머노이드 제어', '모션 생성'],
    delivery: DELIVERY('영상 + 모션 파일(BVH · NPZ) + 로봇 형식 CSV', '동작 클립 단위'),
    spec: [
      { label: '총 분량', value: '10,000시간 이상 (동작 시간)' },
      { label: '인원 구성', value: '1명 · 2명 · 3명 이상' },
      { label: '동작 종류', value: '춤 · 걷기 · 이동 · 상호작용 · 기타' },
      { label: '모션', value: 'BVH · NPZ + 로봇 형식 CSV (Unitree G1 등)' },
      { label: '영상', value: '원본 1080p~4K, 카메라 1~4대 이상, 촬영 원본 코덱' },
      { label: '라벨 · 기본 제공', value: '동작 종류 · 텍스트 설명 · 시뮬레이션 성공 여부 · 원본 클립 ID' },
      { label: '라벨 · 추가', value: '다른 로봇 형식 · 기타 요청 라벨' },
    ],
    customBand: CUSTOM('인원, 동작 종류, 로봇 형식, 라벨을 바꿔 맞춤으로 요청할 수 있어요.'),
  },
]
