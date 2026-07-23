import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Link from '../i18n/Link.jsx'
import {
  ArrowUpRight,
  ChevronDown,
  ClockArrowDown,
  BrainCircuit,
  ShieldCheck,
  Plus,
} from 'lucide-react'
import { TABS, SOLUTIONS, SOLUTIONS_EN } from '../data/solutions.js'
import CtaBanner from '../components/CtaBanner.jsx'
import Reveal from '../components/Reveal.jsx'
import HeroAppMockup from '../components/HeroAppMockup.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'

const ICONS = { clock: ClockArrowDown, brain: BrainCircuit, shield: ShieldCheck }

// Solution demos — reuse the home dashboard interaction (type a query → zoom out
// to reveal results). Legal also navigates to a detail screen on a card click;
// creative/research stop at the zoom-out reveal. Top 8 cards use themed free
// images; the rest stay dark placeholders.
const top8 = (paths) =>
  Array.from({ length: 16 }, (_, i) => (i < 8 ? paths[i % paths.length] : null))

// Legal detail screen content for the 3rd card (intersection signal violation collision).
const LEGAL_DETAIL = {
  // Action summary — one objective sentence describing what is visible in the video.
  summary: '야간 빗길 도로를 주행하던 중 노면이 미끄러워 차량이 미끄러지며 사고가 발생한다.',
  // Script — none for this dashcam clip (no usable audio).
  script: [],
  // Scene analysis — the clip split roughly in half into two segments.
  scenes: [
    {
      range: '00:00:00 - 00:00:09',
      dur: '9초',
      summary: '야간 빗길 시내 도로에서 차량들이 서행하며 주행한다.',
    },
    {
      range: '00:00:09 - 00:00:18',
      dur: '9초',
      summary: '야간 빗길 고속도로에서 선행 차량이 미끄러지며 차로를 벗어난다.',
      img: '/assets/dashcam/dashcam-4b.jpg',
    },
  ],
}

const LEGAL_DETAIL_EN = {
  summary:
    'While driving on a wet road at night, the slippery surface causes the vehicle to skid and crash.',
  script: [],
  scenes: [
    {
      range: '00:00:00 - 00:00:09',
      dur: '9s',
      summary: 'Vehicles drive slowly along a wet city road at night.',
    },
    {
      range: '00:00:09 - 00:00:18',
      dur: '9s',
      summary: 'On the wet night highway, the vehicle ahead skids and veers out of its lane.',
      img: '/assets/dashcam/dashcam-4b.jpg',
    },
  ],
}

// Marketer (home-shopping vitamin) detail — host narration + 11 AI-split scenes
// matched in order to the "vitamin C multi-cut" cuts.
const MKT_SCENE_RANGES = [
  '00:00:00 - 00:00:10', '00:00:10 - 00:00:20', '00:00:20 - 00:00:30',
  '00:00:30 - 00:00:40', '00:00:40 - 00:00:50', '00:00:50 - 00:01:00',
  '00:01:00 - 00:01:10', '00:01:10 - 00:01:20', '00:01:20 - 00:01:30',
  '00:01:30 - 00:01:40', '00:01:40 - 00:01:50',
]
// [cut number, KO summary, EN summary, tag] — interleaved (host → product →
// researcher → product …) so adjacent scene thumbnails stay visually distinct.
const MKT_CUTS = [
  [1, '쇼호스트가 등장해 시청자에게 첫인사를 건넨다.', 'The host appears and greets the viewers.', 'notice'],
  [3, '제품 패키지를 정면에서 보여준다.', 'The product package is shown from the front.', 'insert'],
  [5, '연구원이 카메라를 정면으로 바라보며 등장한다.', 'A researcher appears, facing the camera.', 'etc'],
  [8, '제품을 클로즈업으로 비춘다.', 'The product is shown in close-up.', 'insert'],
  [2, '쇼호스트가 비타민C 제품을 들어 보이며 소개한다.', 'The host holds up the vitamin C product and introduces it.', 'sale'],
  [4, '제품을 측면에서 비추며 디자인을 보여준다.', 'The product is shown from the side to reveal its design.', 'insert'],
  [6, '연구원이 제품의 성분과 효능을 설명한다.', 'The researcher explains the ingredients and benefits.', 'sale'],
  [9, '알약 제형을 가까이서 보여준다.', 'The tablet form is shown up close.', 'insert'],
  [7, '출연자가 제품을 손에 들고 보여준다.', 'A presenter holds the product in hand to show it.', 'sale'],
  [10, '1+1 증정 혜택을 자막과 함께 강조한다.', 'The 1+1 gift offer is highlighted with on-screen text.', 'promo'],
  [11, '품절 임박을 알리며 구매를 유도한다.', 'A “selling out soon” alert prompts viewers to buy.', 'review'],
]
const mktScenes = (en) =>
  MKT_CUTS.map(([n, ko, enT, tag], i) => ({
    range: MKT_SCENE_RANGES[i],
    dur: en ? '10s' : '10초',
    summary: en ? enT : ko,
    img: `/assets/creative/mkt-scene-${n}.jpg`,
    tag,
  }))

const MARKETER_DETAIL = {
  summary: '라이브커머스 스튜디오에서 쇼호스트가 비타민C 제품을 들어 보이며 효능과 구성을 설명한다.',
  script: [
    { speaker: 'A', time: '00:00:02', text: '안녕하세요, 오늘 소개해드릴 제품은 고함량 비타민C입니다.' },
    { speaker: 'B', time: '00:00:07', text: '네, 이번 제품은 하루 권장량을 한 알에 담은 게 가장 큰 특징이에요.' },
    { speaker: 'A', time: '00:00:12', text: '한 알로 1000mg을 채울 수 있다는 거죠?' },
    { speaker: 'B', time: '00:00:16', text: '맞습니다. 거기에 흡수율을 높여주는 성분도 함께 배합했고요.' },
    { speaker: 'A', time: '00:00:21', text: '맛은 어떤가요? 비타민C 하면 신맛이 강할 것 같은데요.' },
    { speaker: 'B', time: '00:00:26', text: '새콤하지만 부담스럽지 않게 조정해서, 매일 챙겨 드시기 좋습니다.' },
    { speaker: 'A', time: '00:00:31', text: '복용 방법은 어떻게 되나요?' },
    { speaker: 'B', time: '00:00:36', text: '하루 한 알, 식후에 물과 함께 드시면 됩니다.' },
    { speaker: 'A', time: '00:00:41', text: '꾸준히 챙겨 드셨을 때 어떤 점이 좋을까요?' },
    { speaker: 'B', time: '00:00:46', text: '피로감 개선과 면역력 유지에 도움을 줄 수 있어요.' },
    { speaker: 'A', time: '00:00:51', text: '보관은 어떻게 하는 게 좋을까요?' },
    { speaker: 'B', time: '00:00:56', text: '직사광선을 피해 서늘하고 건조한 곳에 보관해 주세요.' },
    { speaker: 'A', time: '00:01:01', text: '구성과 가격도 궁금한데요.' },
    { speaker: 'B', time: '00:01:06', text: '오늘은 방송 한정으로 1+1 구성을 특별가에 준비했습니다.' },
    { speaker: 'A', time: '00:01:11', text: '정말 알찬 구성이네요. 마지막으로 한 말씀 부탁드려요.' },
    { speaker: 'B', time: '00:01:16', text: '재고가 많지 않으니 필요하신 분들은 서둘러 주세요!' },
  ],
  scenes: mktScenes(false),
}

const MARKETER_DETAIL_EN = {
  summary:
    'In a live-commerce studio, the host holds up a vitamin C product and explains its benefits and bundle.',
  script: [
    { speaker: 'A', time: '00:00:02', text: 'Hello! Today’s product is our high-dose vitamin C.' },
    { speaker: 'B', time: '00:00:07', text: 'Yes — the key point is that one tablet covers your full daily amount.' },
    { speaker: 'A', time: '00:00:12', text: 'So a single tablet gives you the whole 1000mg?' },
    { speaker: 'B', time: '00:00:16', text: 'Exactly. We also blended in ingredients that boost absorption.' },
    { speaker: 'A', time: '00:00:21', text: 'How does it taste? Vitamin C can be quite sour.' },
    { speaker: 'B', time: '00:00:26', text: 'It’s tangy but balanced, so it’s easy to take every day.' },
    { speaker: 'A', time: '00:00:31', text: 'How should it be taken?' },
    { speaker: 'B', time: '00:00:36', text: 'One tablet a day, after a meal, with water.' },
    { speaker: 'A', time: '00:00:41', text: 'What are the benefits of taking it regularly?' },
    { speaker: 'B', time: '00:00:46', text: 'It can help reduce fatigue and support your immune system.' },
    { speaker: 'A', time: '00:00:51', text: 'How should it be stored?' },
    { speaker: 'B', time: '00:00:56', text: 'Keep it somewhere cool and dry, out of direct sunlight.' },
    { speaker: 'A', time: '00:01:01', text: 'I’m also curious about the bundle and the price.' },
    { speaker: 'B', time: '00:01:06', text: 'For this broadcast only, we’ve prepared a 1+1 bundle at a special price.' },
    { speaker: 'A', time: '00:01:11', text: 'A great deal. Any last words for our viewers?' },
    { speaker: 'B', time: '00:01:16', text: 'Stock is limited, so please hurry if you need it!' },
  ],
  scenes: mktScenes(true),
}

const DEMOS = {
  legal: {
    query: '차량이 추돌하는 사고 장면',
    queryEn: 'Scene of a vehicle rear-end collision',
    placeholder: '장면을 설명해 검색해보세요 - "추돌 사고"',
    placeholderEn: 'Describe a scene to search — "rear-end collision"',
    cardSource: 'Drive',
    pickIndex: 3,
    editor: true,
    durRange: [10, 20],
    images: top8([1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/assets/dashcam/dashcam-${n}.jpg`)),
    detail: LEGAL_DETAIL,
    detailEn: LEGAL_DETAIL_EN,
    titles: [
      '2024가단38201_갑제1호증_전방추돌_블랙박스_원본_20240312',
      '2024가단38201_갑제2호증_측면접촉_블랙박스_20240312',
      '2024고단1789_증제3호_교차로_신호위반_블랙박스_20240228',
      '2024가단41552_갑제1호증_빗길미끄러짐_야간_20240115',
      '2024가단39870_갑제3호증_고속도로_2차사고_블랙박스_20240320',
      '2024가단40233_갑제2호증_끼어들기_접촉_전방_20240305',
      '2024가단42117_갑제4호증_주차장_접촉사고_20240218',
      '2024고단2034_증제2호_횡단보도_보행자_블랙박스_20240301',
      '후방_블랙박스_추돌_연속',
      '교차로_좌회전_사고_카메라2',
      '터널_내부_추돌사고_야간',
      '이면도로_접촉사고_정면',
      '고속도로_급정거_사고_원본',
      '주행중_낙하물_충돌_블랙박스',
      '주차_접촉_뺑소니_증거_백업본',
      '교차로_정면충돌_블랙박스_01',
    ],
    titlesEn: [
      'CASE-2024-38201_EXH-A1_FrontCollision_Dashcam_20240312',
      'CASE-2024-38201_EXH-A2_SideImpact_Dashcam_20240312',
      'CASE-2024-01789_EVID-3_Intersection_SignalViolation_Dashcam_20240228',
      'CASE-2024-41552_EXH-A1_WetRoadSkid_Night_20240115',
      'CASE-2024-39870_EXH-A3_Highway_SecondaryCrash_Dashcam_20240320',
      'CASE-2024-40233_EXH-A2_CutIn_Sideswipe_Front_20240305',
      'CASE-2024-42117_EXH-A4_ParkingLot_Contact_20240218',
      'CASE-2024-02034_EVID-2_Crosswalk_Pedestrian_Dashcam_20240301',
      'rear_dashcam_rearend_seq',
      'intersection_left_turn_crash_cam2',
      'tunnel_rearend_accident_night',
      'backstreet_contact_front',
      'highway_sudden_stop_original',
      'falling_object_impact_dashcam',
      'parking_hit_and_run_evidence_backup',
      'intersection_head_on_dashcam_01',
    ],
  },
  creative: {
    query: '쇼호스트가 비타민을 들어 보이며 설명하는 장면',
    queryEn: 'Scene of a host holding up a vitamin and explaining it',
    placeholder: '장면을 설명해 검색해보세요 - "비타민을 들어 보이는 장면"',
    placeholderEn: 'Describe a scene to search — "holding up a vitamin"',
    orientation: 'vertical',
    pickIndex: 0,
    editor: false,
    durRange: [3600, 7200],
    detail: MARKETER_DETAIL,
    detailEn: MARKETER_DETAIL_EN,
    images: top8([1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/assets/creative/creative-${n}.jpg`)),
    titles: [
      'HS2024-0312_고함량비타민C_생방송_제품설명_MC컷_20240312',
      'LC2024-0115_비타민D_라이브커머스_시연리액션_20240115',
      'VOD2024-0220_멀티비타민_숏폼_제품클로즈업_납품본_20240220',
      'HS2024-0305_비타민B컴플렉스_특집편성_효능설명_원본_20240305',
      '루테인_라이브커머스_녹화본',
      '콜라겐_먹방_리액션_숏폼',
      '오메가3_성분강조_자막용_원본',
      '프로바이오틱스_언박싱_세로',
      '홍삼스틱_휴대성_시연_컷',
      '효소_제품소개_풀샷_스튜디오',
      '멀티비타민_가격강조_구간',
      '단백질바_먹방_B컷',
      '흑마늘즙_시연_클로즈업',
      '밀크씨슬_효능_인터뷰_세로',
      '체험단_리뷰_숏폼_편집본',
      '한정수량_마감임박_방송_하이라이트',
    ],
    titlesEn: [
      'HS2024-0312_HighDoseVitaminC_LiveBroadcast_ProductDemo_MC_20240312',
      'LC2024-0115_VitaminD_LiveCommerce_DemoReaction_20240115',
      'VOD2024-0220_Multivitamin_Short_ProductCloseup_Delivery_20240220',
      'HS2024-0305_VitaminBComplex_Special_BenefitExplainer_Original_20240305',
      'lutein_live_commerce_recording',
      'collagen_mukbang_reaction_short',
      'omega3_ingredient_caption_original',
      'probiotics_unboxing_vertical',
      'ginseng_stick_portability_demo',
      'enzyme_product_intro_fullshot_studio',
      'multivitamin_price_highlight',
      'protein_bar_mukbang_Bcut',
      'black_garlic_juice_demo_closeup',
      'milk_thistle_benefit_interview_vertical',
      'tester_review_short_edit',
      'limited_stock_ending_broadcast_highlight',
    ],
  },
  research: {
    query: '로봇이 물체를 집다 놓치는 구간',
    queryEn: 'Moment a robot drops the object it was gripping',
    placeholder: '장면을 설명해 검색해보세요 - "이상 동작"',
    placeholderEn: 'Describe a scene to search — "anomalous motion"',
    durRange: [3600, 10800],
    sceneToggle: true,
    // video mode → factory/lab shots; scene mode → the original robot cuts
    images: top8([1, 2, 3, 4, 5, 6, 7].map((n) => `/assets/research/research-vid-${n}.jpg`)),
    sceneImages: top8([1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/assets/research/research-${n}.jpg`)),
    titles: [
      '로봇팔_파지_테스트_고속카메라_01',
      '보행로봇_균형_시험_원본',
      '매니퓰레이터_구동_반복_시험',
      '산업용로봇_조립_라인_카메라2',
      '구동부_토크_측정_실험_백업본',
      '자동화셀_작동_연속_녹화',
      '드론_군집비행_안정성_시험',
      '휴머노이드_관절_구동_로그',
      '쿼드러페드_보행_테스트_야간',
      '그리퍼_파지력_측정_고속',
      '로봇_충돌회피_시뮬레이션_로그',
      '서보모터_과열_점검_원본',
      '비전_인식_오차_검출_구간',
      '충격_흡수_관절_시험_백업본',
      '엔드이펙터_정밀도_시험_4K',
      '로봇_이상진동_검출_구간_원본',
    ],
    titlesEn: [
      'robot_arm_grasp_test_highspeed_01',
      'legged_robot_balance_test_original',
      'manipulator_actuation_repeat_test',
      'industrial_robot_assembly_line_cam2',
      'joint_torque_measurement_backup',
      'automation_cell_operation_recording',
      'drone_swarm_stability_test',
      'humanoid_joint_actuation_log',
      'quadruped_gait_test_night',
      'gripper_grip_force_highspeed',
      'robot_collision_avoidance_sim_log',
      'servo_motor_overheat_check_original',
      'vision_recognition_error_segment',
      'impact_absorption_joint_test_backup',
      'end_effector_precision_test_4K',
      'robot_abnormal_vibration_segment_original',
    ],
  },
}

// Scales the fixed 1440-wide mockup to fit the demo box and clips it to a fully
// rounded frame; the box aspect crops the bottom so the search + results show.
function SolutionDemo({ tab }) {
  const { lang } = useLang()
  const cfg = DEMOS[tab]
  const frameRef = useRef(null)
  const [scale, setScale] = useState(0.8)
  const [radius, setRadius] = useState(20)
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      setScale(w / 1440)
      setRadius(w >= 720 ? 20 : 14)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  if (!cfg) return null
  const en = lang === 'en'
  return (
    <div
      ref={frameRef}
      className="relative aspect-[1040/470] w-full overflow-hidden rounded-t-[20px] bg-white shadow-card ring-1 ring-grayscale-100 max-sm:rounded-t-[14px]"
      style={{ transform: 'translateZ(0)', clipPath: `inset(0 round ${radius}px ${radius}px 0 0)` }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {/* key={tab + lang} remounts the mockup on tab/language change so its
            animation timeline restarts with the new content. */}
        <HeroAppMockup
          key={tab + lang}
          query={en ? cfg.queryEn : cfg.query}
          titles={en ? cfg.titlesEn : cfg.titles}
          images={cfg.images}
          placeholder={en ? cfg.placeholderEn : cfg.placeholder}
          sweep={false}
          orientation={cfg.orientation || 'horizontal'}
          detail={en ? cfg.detailEn || null : cfg.detail || null}
          cardSource={cfg.cardSource || null}
          pickIndex={cfg.pickIndex ?? 3}
          editor={cfg.editor ?? false}
          durRange={cfg.durRange || null}
          sceneToggle={cfg.sceneToggle ?? false}
          sceneImages={cfg.sceneImages || null}
        />
      </div>
    </div>
  )
}

// FAQ accordion — mirrors the home page "4 features" numbered accordion.
function FaqAccordion({ items }) {
  const [open, setOpen] = useState(-1)
  return (
    <div className="w-full max-w-[880px] border-t border-grayscale-100">
      {items.map((f, i) => {
        const active = open === i
        return (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(active ? -1 : i)}
            className="group relative block w-full text-left"
          >
            <div className="flex items-center gap-6 py-6 max-sm:gap-4 max-sm:py-5">
              <h3
                className={`text-xl font-bold tracking-[-0.5px] transition-colors max-sm:text-base ${
                  active ? 'text-navy-500' : 'text-grayscale-800'
                }`}
              >
                {f.q}
              </h3>
              <span
                className={`ml-auto transition-colors ${
                  active ? 'text-navy-500' : 'text-grayscale-500 group-hover:text-navy-500'
                }`}
              >
                <Plus
                  size={28}
                  strokeWidth={1}
                  className={`transition-transform duration-300 ease-out ${
                    active ? '-rotate-45' : 'rotate-0'
                  }`}
                />
              </span>
            </div>
            <div
              className={`grid transition-all duration-500 ease-out ${
                active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 font-noto text-base leading-[1.7] tracking-[-0.4px] text-grayscale-500">
                  {f.a}
                </p>
              </div>
            </div>
            <span className="absolute bottom-0 left-0 right-0 h-px bg-grayscale-100" />
            <span
              className={`absolute bottom-0 left-0 right-0 h-px origin-left bg-navy-500 transition-transform duration-500 ease-out ${
                active ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

export default function Solution() {
  const { lang, t } = useLang()
  const [params, setParams] = useSearchParams()
  const tab = SOLUTIONS[params.get('tab')] ? params.get('tab') : 'legal'
  const data = (lang === 'en' ? SOLUTIONS_EN : SOLUTIONS)[tab]
  // Tabs migrated to the new layout expose a `faq` array.
  const isNew = Array.isArray(data.faq)

  // Sliding tab indicator — tracks the active pill's box and animates between tabs
  const tabsRef = useRef(null)
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 })
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabsRef.current?.querySelector('[data-active="true"]')
      if (el)
        setPill({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [tab])

  return (
    <div className="bg-grayscale-10">
      {/* ───────── Hero ───────── */}
      {isNew ? (
        <section
          className="relative flex min-h-screen w-full flex-col items-center px-[60px] pb-0 pt-[150px] max-lg:px-8 max-lg:pt-[110px] max-sm:min-h-0 max-sm:px-5 max-sm:pt-[90px]"
          style={{
            // Light, airy gradient — same hero footprint as home, no interaction.
            background: 'linear-gradient(180deg, #f4f8fe 0%, #e7f0fb 55%, #d8e7f8 100%)',
          }}
        >
          {/* Centered copy */}
          <Reveal className="flex w-full max-w-[860px] flex-col items-center gap-9 text-center">
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-col items-center gap-2">
                {/* in-page switcher across the three solution pages —
                    same pill style as the terms/privacy (Policy) page tabs */}
                <div
                  ref={tabsRef}
                  className="relative mb-6 inline-grid grid-cols-3 gap-1 rounded-full bg-white p-1 shadow-card"
                >
                  <span
                    aria-hidden
                    className="absolute rounded-full bg-softblue-50 transition-all duration-300 ease-out"
                    style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }}
                  />
                  {TABS.map((tb) => {
                    const active = tb.id === tab
                    return (
                      <button
                        key={tb.id}
                        data-active={active}
                        onClick={() => setParams({ tab: tb.id })}
                        className={`relative z-10 rounded-full px-[16px] py-[10px] text-center text-sm font-semibold tracking-[-0.35px] transition-colors ${
                          active ? 'text-navy-500' : 'text-neutral-300 hover:text-grayscale-500'
                        }`}
                      >
                        {tb.label}
                      </button>
                    )
                  })}
                </div>
                <h1 className="font-product text-[54px] font-bold leading-[1.3] text-grayscale-800 max-md:text-[40px] max-sm:text-[30px]">
                  {data.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
              </div>
              <p className="font-noto text-xl font-medium leading-[1.5] tracking-[-0.5px] text-grayscale-800 max-sm:text-base">
                {data.subtitle}
              </p>
            </div>
            <Link to="/contact" className="btn-primary">
              {t('한 달 무료신청', 'Start Free Trial')}
              <ArrowUpRight size={20} strokeWidth={2} />
            </Link>
          </Reveal>

          {/* Grows to push the demo to the bottom, filling the viewport like home */}
          <div aria-hidden className="w-full flex-1 max-sm:hidden" />

          {/* Demo — interactive search → zoom-out mockup, themed per tab */}
          <Reveal
            className="mt-[72px] w-full max-w-[1240px] max-sm:mt-[100px] max-sm:w-screen max-sm:max-w-none"
            delay={120}
          >
            <SolutionDemo tab={tab} />
          </Reveal>
        </section>
      ) : (
        <section className="flex flex-col items-center px-[100px] pb-[140px] pt-[150px] max-lg:px-8 max-lg:pb-[100px] max-lg:pt-[120px] max-sm:px-5 max-sm:pb-[72px] max-sm:pt-[96px]">
          <div className="flex w-full max-w-[1240px] flex-col items-center gap-[120px] max-lg:gap-16 max-sm:gap-12">
            {/* Tab pills */}
            <div
              ref={tabsRef}
              className="relative flex items-center gap-1 rounded-full bg-white p-1 shadow-card max-sm:w-[300px]"
            >
              {/* sliding highlight */}
              <span
                aria-hidden
                className="absolute rounded-full bg-softblue-50 transition-all duration-300 ease-out"
                style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }}
              />
              {TABS.map((t) => {
                const active = t.id === tab
                return (
                  <button
                    key={t.id}
                    data-active={active}
                    onClick={() => setParams({ tab: t.id })}
                    className={`relative z-10 flex w-[133px] items-center justify-center rounded-full px-4 py-[10px] text-lg font-semibold leading-[1.4] tracking-[-0.45px] transition-colors max-sm:w-auto max-sm:flex-1 max-sm:px-1 max-sm:text-sm ${
                      active ? 'text-navy-500' : 'text-neutral-300 hover:text-grayscale-500'
                    }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            {/* Hero copy + image */}
            <Reveal className="flex w-full items-center gap-[100px] max-lg:flex-col max-lg:items-start max-lg:gap-10">
              <div className="flex flex-1 flex-col items-start gap-10">
                <div className="flex flex-col gap-5">
                  <p className="font-product text-2xl font-bold leading-[1.4] text-navy-500 max-sm:text-xl">
                    {data.label}
                  </p>
                  <h1 className="font-product text-[54px] font-bold leading-[1.4] text-grayscale-800 max-md:text-[34px] max-sm:text-[28px]">
                    {data.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                </div>
                <Link to="/contact" className="btn-primary">
                  {t('한 달 무료신청', 'Start Free Trial')}
                  <ArrowUpRight size={20} strokeWidth={2} />
                </Link>
              </div>
              <img
                src={data.hero}
                alt=""
                className="h-[313px] w-[515px] shrink-0 rounded-[10px] object-cover max-lg:h-auto max-lg:w-full max-lg:shrink"
              />
            </Reveal>
          </div>

          {/* Question cards */}
          <Reveal className="mt-[120px] flex overflow-hidden rounded-[20px] bg-white shadow-card max-lg:mt-[60px] max-lg:w-full max-lg:flex-col" delay={120}>
            {data.questions.map((q, i) => (
              <div
                key={i}
                className={`flex w-[400px] items-center justify-center px-6 py-10 text-center max-lg:w-full ${
                  i === 1 ? 'border-x border-neutral-100 max-lg:border-x-0 max-lg:border-y' : ''
                }`}
              >
                <p className="text-lg font-semibold leading-[1.4] tracking-[-0.45px] text-navy-500">
                  {q.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </Reveal>
        </section>
      )}

      {isNew ? (
        <>
          {/* ───────── Reasons (5) — title left, 2-col outlined cards right ───────── */}
          <Reveal
            as="section"
            className="flex justify-center px-[100px] pb-[120px] pt-[120px] max-lg:px-8 max-sm:px-5 max-sm:pb-[80px] max-sm:pt-[80px]"
          >
            <div className="flex w-full max-w-[1180px] items-start gap-16 max-lg:flex-col max-lg:gap-10">
              <h2 className="w-[500px] shrink-0 break-keep text-[40px] font-bold leading-[1.4] tracking-[-1px] text-grayscale-800 max-lg:w-full max-md:text-[28px] max-sm:text-[24px]">
                {data.reasonsTitle.split('\n').map((line, i) => (
                  <span key={line} className={`block ${i === 1 ? 'text-navy-500' : ''}`}>
                    {line}
                  </span>
                ))}
              </h2>
              <div className="grid flex-1 grid-cols-2 max-sm:grid-cols-1">
                {data.reasonsList.map((r, i) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-4 border-grayscale-200 p-7 max-sm:border-r-0 max-sm:p-6 ${
                      i >= 2 ? 'border-t' : ''
                    } ${i % 2 === 0 ? 'border-r' : ''} ${i === 1 ? 'max-sm:border-t' : ''}`}
                  >
                    <h3 className="text-xl font-bold leading-[1.4] tracking-[-0.5px] text-grayscale-800 max-sm:text-lg">
                      {r.title.split('\n').map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <p className="font-noto text-base leading-[1.7] tracking-[-0.4px] text-grayscale-500 [word-break:keep-all]">
                      {r.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ───────── FAQ ───────── */}
          <Reveal
            as="section"
            className="flex flex-col items-center gap-16 px-[100px] pb-[200px] pt-[100px] max-lg:px-8 max-lg:gap-12 max-sm:px-5 max-sm:gap-10 max-sm:pb-[120px] max-sm:pt-[70px]"
          >
            <h2 className="text-center text-[40px] font-bold leading-[1.4] tracking-[-1px] text-grayscale-800 max-md:text-[28px] max-sm:text-[24px]">
              {t('자주 묻는 질문', 'Frequently Asked Questions')}
            </h2>
            <FaqAccordion items={data.faq} />
          </Reveal>
        </>
      ) : (
        <>
          {/* ───────── Steps ───────── */}
          <Reveal as="section" className="flex items-center justify-center py-[100px] px-8 max-sm:px-5 max-sm:py-[60px]">
            <div className="flex flex-col items-center gap-10">
              {data.steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-10">
                  {i > 0 && <ChevronDown size={64} strokeWidth={1.5} className="text-[#dcdde6]" />}
                  <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-[40px] font-bold leading-[1.4] tracking-[-1px] text-navy-500 max-md:text-[28px] max-sm:text-[24px]">
                      Step {i + 1}
                    </p>
                    <div className="flex flex-col items-center gap-6 text-grayscale-800">
                      <h3 className="text-4xl font-bold leading-[1.4] tracking-[-0.9px] max-md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="font-noto text-2xl leading-[1.4] tracking-[-0.6px] max-sm:text-base">
                        {step.desc.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ───────── Reasons ───────── */}
          <Reveal as="section" className="flex flex-col items-center gap-20 pb-[200px] pt-[100px] px-8 max-lg:gap-12 max-lg:pb-[120px] max-sm:px-5 max-sm:gap-10 max-sm:pb-[80px] max-sm:pt-[60px]">
            <h2 className="text-center text-[40px] font-bold leading-[1.4] tracking-[-1px] text-neutral-800 max-md:text-[28px] max-sm:text-[24px]">
              <span className="text-navy-500">{data.reasonHighlight}</span>가
              <br />
              하임덱스를 선택하는 이유
            </h2>
            <div className="flex items-stretch max-lg:w-full max-lg:flex-col">
              {data.reasons.map((r, i) => {
                const Icon = ICONS[r.icon]
                return (
                  <div
                    key={i}
                    className={`flex w-[440px] flex-col items-center gap-10 p-[30px] text-center max-lg:w-full ${
                      i === 1 ? 'border-x border-neutral-300 max-lg:border-x-0 max-lg:border-y' : ''
                    }`}
                  >
                    <Icon size={100} strokeWidth={1.5} className="text-navy-500" />
                    <div className="flex flex-col items-center gap-5 text-grayscale-800">
                      <h3 className="text-[28px] font-bold leading-[1.4] tracking-[-0.7px] max-sm:text-2xl">
                        {r.title}
                      </h3>
                      <p className="font-noto text-lg leading-[1.4] tracking-[-0.45px]">
                        {r.desc.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </>
      )}

      {/* ───────── CTA ───────── */}
      <Reveal>
        {isNew ? (
          <CtaBanner
            title={data.cta.title}
            primaryLabel={t('도입 문의', 'Get in Touch')}
            outlineLabel={null}
          />
        ) : (
          <CtaBanner
            title={data.cta.title}
            subtitle={
              <>
                <span className="font-semibold text-navy-500">{data.cta.highlight}</span>
                {data.cta.rest}
              </>
            }
          />
        )}
      </Reveal>
    </div>
  )
}
