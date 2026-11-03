// HubSpot mapping for data-marketplace sample requests (/data, /request). Imported by
// api/contact.js; the leading underscore keeps Vercel from deploying it as its own function.
//
// Two HubSpot forms, set up by sales:
//   quick    — the email-only card: email only, no auto-reply.
//   detailed — the full form: every answer below, and HubSpot sends the receipt auto-reply.
// Not secret (any HubSpot embed exposes them). Env vars override them; HubSpot is still only
// called where HUBSPOT_PORTAL_ID is set (production), so previews create no contacts.
export const SAMPLE_FORM_GUIDS = {
  quick: process.env.HUBSPOT_SAMPLE_QUICK_FORM_GUID || '225641c1-bf9c-4e5a-a79b-49e80fb06ee4',
  detailed: process.env.HUBSPOT_SAMPLE_FORM_GUID || '2a7cb4a8-a100-45ba-b2f4-a196ffc908a0',
}

// The forms send the label the visitor saw (KO or EN); HubSpot's choice properties only store
// their internal values. Labels must match src/data/dataMarket.{ko,en}.js exactly —
// scripts/check-hubspot-options.mjs fails the build when a label has no entry here.
export const SAMPLE_OPTION_VALUES = {
  collections: {
    multi_speaker_dialogue: ['다화자 대화 (음성 + 영상)', 'Multi-Speaker Conversation (Audio + Video)'],
    speaker_separated_dialogue: ['화자 분리 대화 음성', 'Conversational Speech, Speaker-Separated'],
    synced_multicam: ['동기화 멀티캠 원본', 'Synchronized Multi-Camera Originals'],
    full_body_motion: ['전신 동작', 'Whole-Body Human Motion'],
    host_product_demo: ['진행자 · 제품 시연', 'Presenter & Product Demo'],
    idol_stage_practice: ['아이돌 무대 · 연습', 'Idol stages · practice'],
    live_commerce_hosts: ['라이브커머스 쇼호스트', 'Live-commerce hosts'],
    b_roll_footage: ['배경 footage', 'B-roll footage'],
    variety_reality_raw: ['예능 리얼리티 원본', 'Reality show originals'],
    other: ['그 외 데이터', 'Something else'],
  },
  model: {
    video_generation: ['영상 생성', 'Video generation'],
    audio_video_generation: ['음성 · 영상 생성', 'Audio-video generation'],
    speech: ['음성 · 스피치', 'Voice & speech'],
    world_model: ['월드 모델', 'World models'],
    humanoid: ['휴머노이드', 'Humanoid'],
    video_understanding: ['영상 이해', 'Video understanding'],
    other: ['기타', 'Other'],
  },
  volume: {
    under_100h: ['100시간 미만', '<100h'],
    '100_1000h': ['100~1,000시간', '100–1,000h'],
    '1000_10000h': ['1,000~10,000시간', '1,000–10,000h'],
    over_10000h: ['10,000시간 이상', '10,000h+'],
  },
  license: {
    non_exclusive: ['비독점', 'Non-exclusive'],
    exclusive: ['독점', 'Exclusive'],
    undecided: ['아직 모름', 'Not sure'],
  },
  timeline: {
    this_month: ['이번 달', 'This month'],
    this_quarter: ['이번 분기', 'This quarter'],
    exploring: ['알아보는 중', 'Exploring'],
  },
}

const LOOKUP = Object.fromEntries(
  Object.entries(SAMPLE_OPTION_VALUES).map(([kind, values]) => [
    kind,
    new Map(Object.entries(values).flatMap(([value, labels]) => labels.map((l) => [l, value]))),
  ]),
)

// Label -> internal value, or '' when unknown. An unknown value is dropped rather than sent: HubSpot
// rejects an invalid option, and the visitor's other answers should still be saved.
export function optionValue(kind, label) {
  if (typeof label !== 'string' || !label) return ''
  const value = LOOKUP[kind].get(label.trim())
  if (!value) console.warn(`HubSpot sample: no ${kind} value for label "${label.slice(0, 80)}"`)
  return value || ''
}

const text = (v, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

// [HubSpot field name, value] pairs for each sample form. Empty values are filtered by the caller.
export function sampleFields(body, email) {
  if (body.quick === true) return [['email', email]]
  const collections = (Array.isArray(body.collections) ? body.collections : [])
    .map((c) => optionValue('collections', c))
    .filter(Boolean)
  return [
    ['firstname', text(body.name, 100)],
    ['email', email],
    ['company', text(body.company, 200)],
    ['sample_collections', [...new Set(collections)].join(';')],
    ['sample_scene_description', text(body.scene)],
    ['sample_model_type', optionValue('model', body.model)],
    ['sample_data_gap', text(body.gap)],
    ['sample_volume', optionValue('volume', body.volume)],
    ['sample_preferred_format', text(body.format)],
    ['sample_license', optionValue('license', body.license)],
    ['sample_timeline', optionValue('timeline', body.timeline)],
  ]
}
