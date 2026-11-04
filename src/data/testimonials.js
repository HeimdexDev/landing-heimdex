// Customer quotes, keyed by industry slug (see data/industries.js). Moved out of
// the old Home page so the main slider and the industry pages share one source.
// An industry with no entry hides its testimonial block — education has no
// real quote yet (wireframe 03-3: "실사용 후기 수급 필요").
export const TESTIMONIALS = {
  commerce: [
    {
      who: '라이브커머스 8년차 PD',
      whoEn: 'Live Commerce Producer · 8 yrs',
      quote:
        '퇴사자가 많다 보니 인수인계가 쉽지 않아요. NAS, 하드, 클라우드까지 하임덱스로 소스 찾는 시간을 아껴서 컷 편집에만 집중할 수 있어\n살 것 같습니다.',
      quoteEn:
        'With high turnover, handovers are tough. Across NAS, drives and cloud, Heimdex saves so much time finding sources that I can focus purely on the edit. A lifesaver.',
    },
  ],
  media: [
    {
      who: '엔터테인먼트 7년차 PD',
      whoEn: 'Entertainment Producer · 7 yrs',
      quote:
        '다인원 그룹은 콘텐츠 양부터 압도적입니다. 멤버별로 구간을 잘라서 만들어줄 수 있어서 팬들도, 멤버들도 만족하고 있어요.',
      quoteEn:
        'With large groups, the sheer volume of content is overwhelming. It cuts clips per member, so both the fans and the members are happy.',
    },
  ],
  legal: [
    {
      who: '이혼 전문 8년차 서OO 변호사',
      whoEn: 'Divorce Attorney · 8 yrs',
      quote:
        '보안 때문에 녹취록조차 속기사를 써야 했고, 클라우드 AI도 못 썼어요. 하임덱스는 따로 업로드하지 않아도 되어 의뢰인 영상 유출 걱정 없이\n믿고 쓸 수 있어 좋습니다.',
      quoteEn:
        'For security we even hired stenographers and couldn’t use cloud AI. With Heimdex there are no uploads, so I can rely on it without worrying about leaking a client’s footage.',
    },
  ],
  research: [
    {
      who: '피지컬 AI 기업 7년차 책임',
      whoEn: 'Physical AI Company · Lead, 7 yrs',
      quote:
        '로그는 깨끗한데 실제 구동이 튀면 원인 찾느라 머리 터지거든요.\n특정 동작 맥락만 치면 로그랑 일치하는 구간을 바로 하이라이트해 주니까,\n제가 놓친 미세 오류까지 다 보입니다.',
      quoteEn:
        'The logs look clean, but when a run misbehaves, finding the cause is a headache. Type the context of a motion and it highlights the matching segment instantly — even the subtle errors I missed.',
    },
  ],
}
