// Vercel Serverless Function — POST /api/contact
// 문의 폼 제출을 Slack CRM 채널로 전송한다. (playground CRM 구현과 동일한 방식)

/* ── Simple IP-based rate limit (5 req / 10 min per IP, best-effort) ── */
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
  return false
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
    if (isRateLimited(ip)) {
      return res
        .status(429)
        .json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' })
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const { name, email, phone } = body
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({ error: '필수 항목을 입력해주세요.' })
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
이름: ${body.name}
회사명: ${body.company || '-'}
이메일: ${body.email}
연락처: ${body.phone}

문의내용:
${body.message || '(내용 없음)'}

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
