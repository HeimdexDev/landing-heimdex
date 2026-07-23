// Vercel Serverless Function — POST /api/contact
// 문의 폼 제출을 Slack CRM 채널로 전송한다. (playground CRM 구현과 동일한 방식)

/* ── IP 기반 rate limit (5 req / 10 min, best-effort) ──
   NOTE: in-memory Map은 Vercel 인스턴스마다 분리/리셋되므로 완전한 방어는 아니다.
   지속 방어가 필요하면 Vercel KV/Upstash로 이전. 1차 봇 차단은 허니팟이 담당. */
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const ipHits = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  if (hits.length >= RATE_MAX) {
    ipHits.set(ip, hits)
    return true
  }
  hits.push(now)
  ipHits.set(ip, hits)
  // Map 무한 증식 방지: 오래된 항목 정리 (스푸핑 대비 상한)
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) ipHits.delete(k)
    }
  }
  return false
}

// Slack mrkdwn 안전화: 백틱(코드펜스 탈출)·멘션(<!channel>)·마스킹 링크 무력화 + 길이 컷.
// Slack은 코드블록 내부 백틱 이스케이프를 지원하지 않으므로 문자 치환으로 방어한다.
function sanitizeForSlack(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/`/g, 'ˋ') //           ` → ˋ  (코드펜스 탈출 차단)
    .replace(/<!([^>]*)>/g, '(​$1)') // <!channel>/<!here> 등 특수 멘션 무력화
    .replace(/<(https?:\/\/[^|>]*)\|([^>]*)>/g, '$1 ($2)') // 마스킹 링크 → 원본 URL 노출
    .slice(0, 2000)
}

const EMAIL_RE = /^\S+@\S+\.\S{2,}$/
const MAX_LEN = { name: 100, email: 254, phone: 30, company: 200, message: 2000 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    // Vercel은 실제 클라이언트 IP를 x-real-ip에 설정한다.
    // x-forwarded-for 좌측 값은 클라이언트가 스푸핑 가능하므로 신뢰하지 않는다.
    const ip =
      req.headers['x-real-ip'] ||
      (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
      'unknown'
    if (isRateLimited(ip)) {
      return res
        .status(429)
        .json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' })
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}

    // 허니팟: 사람 눈엔 숨겨진 필드. 값이 있으면 봇 → 조용히 성공 응답(공격자에 단서 미제공).
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return res.status(200).json({ success: true })
    }

    const { name, email, phone } = body

    // 타입 검증: 문자열이 아니면 .trim() 에서 TypeError → 400 으로 명확히 반환.
    if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') {
      return res.status(400).json({ error: '잘못된 요청 형식입니다.' })
    }
    // 필수값
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return res.status(400).json({ error: '필수 항목을 입력해주세요.' })
    }
    // 길이 제한 (payload 남용 방지)
    for (const [field, max] of Object.entries(MAX_LEN)) {
      if (typeof body[field] === 'string' && body[field].length > max) {
        return res.status(400).json({ error: '입력값이 너무 깁니다.' })
      }
    }
    // 형식 검증 (클라이언트 검증 우회 대비 — 서버에서 재확인)
    if (!EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ error: '유효한 이메일을 입력해주세요.' })
    }
    if (phone.replace(/\D/g, '').length < 7) {
      return res.status(400).json({ error: '유효한 연락처를 입력해주세요.' })
    }

    const webhookUrl = process.env.SLACK_CRM_WEBHOOK_URL
    if (!webhookUrl) {
      console.error('SLACK_CRM_WEBHOOK_URL is not configured')
      return res.status(500).json({ error: '서버 설정 오류' })
    }

    const submittedAt = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    })

    const slackMessage = {
      text: `*[LANDING] NEW-CRM* — 상담 문의

\`\`\`
이름: ${sanitizeForSlack(body.name)}
회사명: ${sanitizeForSlack(body.company) || '-'}
이메일: ${sanitizeForSlack(body.email)}
연락처: ${sanitizeForSlack(body.phone)}

문의내용:
${sanitizeForSlack(body.message) || '(내용 없음)'}

마케팅 수신 동의: ${body.marketingAgreed ? '동의' : '미동의'}
접수시간: ${submittedAt}
\`\`\``,
    }

    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage),
    })

    if (!slackRes.ok) {
      console.error('Slack webhook failed:', slackRes.status)
      return res.status(502).json({ error: '전송 실패' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return res.status(500).json({ error: '서버 오류' })
  }
}
