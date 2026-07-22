// Static demo data for the hero product mockup (HeroAppMockup).
// Separated so the component file stays focused on render/animation logic.

export const QUERY = '무대 위에서 공연하는 장면'
export const QUERY_EN = 'Scene of a performance on stage'

export const SOURCES = {
  Drive: '#68b2ff', // softblue/300
  Youtube: '#cd626a', // red/300
  Local: '#66c28d', // green/300
  Disk: '#c4c5d4', // grayscale/300
}

// Thumbnails themed to the query (stage/concert), served locally so nothing
// renders from an external host at runtime.
export const SOURCE_CYCLE = ['Drive', 'Youtube', 'Local', 'Disk']
// Varied per-card titles — a few long enough to trigger the ellipsis.
export const TITLES = [
  '2024_단독콘서트_앙코르무대_4K',
  '신곡_타이틀곡_직캠_원본',
  '리허설_풀샷_카메라2',
  '팬미팅_오프닝_퍼포먼스_하이라이트_편집본_납품용_최종',
  '음악방송_1위_앵콜무대',
  '쇼케이스_하이라이트',
  '월드투어_서울_2일차_엔딩무대',
  '백스테이지_비하인드_인터뷰',
  '연말시상식_축하공연_세로형',
  '유닛무대_안무연습_드라이런',
  '데뷔_쇼케이스_타이틀무대_고화질_원본_최종_real_final',
  '라이브클립_쇼츠용_세로',
  '콘서트_오프닝_인트로_VCR',
  '앵콜무대_떼창_관객반응',
  '아레나_공연_드론샷',
  '무대_조명_리허설_테스트',
]
export const TITLES_EN = [
  '2024_solo_concert_encore_4K',
  'title_track_fancam_original',
  'rehearsal_fullshot_cam2',
  'fanmeeting_opening_performance_highlight_final',
  'music_show_no1_encore_stage',
  'showcase_highlight',
  'world_tour_seoul_day2_ending',
  'backstage_behind_interview',
  'yearend_awards_special_stage_vertical',
  'unit_stage_choreo_dryrun',
  'debut_showcase_title_stage_4K_original_final',
  'live_clip_for_shorts_vertical',
  'concert_opening_intro_VCR',
  'encore_singalong_crowd_reaction',
  'arena_show_drone_shot',
  'stage_lighting_rehearsal_test',
]

export const STAGE_IMAGES = Array.from({ length: 16 }, (_, i) => `/assets/stage/stage-${i + 1}.jpg`)
export const DEFAULT_PLACEHOLDER = '파일명이나 폴더명으로 찾아보세요 - "마케팅_쇼츠_01"'
export const DEFAULT_PLACEHOLDER_EN = 'Search by file or folder name — "marketing_short_01"'

export const SPEAKER_COLOR = { A: '#d53b49', B: '#3fb675' }

export const INITIAL_SCENES = [{ w: 179 }, { w: 315 }, { w: 469 }, { w: 198 }, { w: 206 }]

export const SPLIT_TAG = {
  sale: { ko: '판매', en: 'Sales', bg: '#aee2ff', fg: '#173d5a' },
  insert: { ko: '인서트', en: 'Insert', bg: '#ffd4b4', fg: '#603814' },
  notice: { ko: '방송안내', en: 'Notice', bg: '#beffbe', fg: '#1c3829' },
  promo: { ko: '프로모션', en: 'Promo', bg: '#e4c1ff', fg: '#3b1d4d' },
  review: { ko: '반응리뷰', en: 'Review', bg: '#ffcee3', fg: '#4e2936' },
  etc: { ko: '기타', en: 'Etc', bg: '#e4e4e3', fg: '#373530' },
}
export const SPLIT_TAG_ORDER = ['sale', 'insert', 'notice', 'promo', 'review', 'etc']
