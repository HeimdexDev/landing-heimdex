// Vercel Serverless Function — POST /api/contact
// Forwards contact-form submissions to the Slack CRM channel. (same approach as the playground CRM)

/* ── IP-based rate limit (5 req / 10 min, best-effort) ──
   NOTE: the in-memory Map is isolated/reset per Vercel instance, so it is not a full defense.
   For durable protection, move to Vercel KV/Upstash. First-line bot blocking is the honeypot. */
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
  // Prevent unbounded Map growth: sweep stale entries (cap against spoofing)
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) ipHits.delete(k)
    }
  }
  return false
}

// Sanitize for Slack mrkdwn: neutralize backticks (code-fence escape), mentions (<!channel>), and
// masked links, plus a length cap. Slack has no backtick escape inside a code block, so we defend
// by character substitution.
function sanitizeForSlack(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/`/g, 'ˋ') //              backtick -> ˋ  (blocks code-fence escape)
    .replace(/<!([^>]*)>/g, '(​$1)') //  neutralize special mentions like <!channel>/<!here>
    .replace(/<(https?:\/\/[^|>]*)\|([^>]*)>/g, '$1 ($2)') // masked link -> expose the raw URL
    .slice(0, 2000)
}

const EMAIL_RE = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>".]{2,}$/
const MAX_LEN = { name: 100, email: 254, phone: 30, company: 200, jobTitle: 100, message: 2000 }

/* ── HubSpot Forms API (creates the contact + triggers the HubSpot auto-reply workflow) ──
   Inert unless HUBSPOT_PORTAL_ID and HUBSPOT_FORM_GUID are set. Scope them to Vercel PRODUCTION
   only, or Preview deployments create real contacts and send real mail. Marketing consent is sent only when the subscription type id is set.
   The HubSpot form accepts unknown field names and malformed emails silently, so validation stays
   ours (above). */
const HUBSPOT_TIMEOUT_MS = 3000

// HubSpot stores this text as the record of what the visitor agreed to, so it must match the label
// they saw (/en visitors see English labels).
const CONSENT_TEXT = {
  ko: {
    process: '개인정보 처리방침에 동의합니다.',
    marketing: '하임덱스의 마케팅 정보를 수신하는 데 동의합니다.',
  },
  en: {
    process: 'I agree to the Privacy Policy.',
    marketing: 'I agree to receive marketing information from Heimdex.',
  },
}

async function submitToHubSpot(body) {
  const portalId = process.env.HUBSPOT_PORTAL_ID
  const formGuid = process.env.HUBSPOT_FORM_GUID
  if (!portalId || !formGuid) return

  const fields = [
    ['firstname', body.name],
    ['company', body.company],
    ['jobtitle', body.jobTitle],
    ['phone', body.phone],
    ['email', body.email],
    ['message', body.message],
  ]
    .filter(([, v]) => typeof v === 'string' && v.trim())
    .map(([name, v]) => ({ objectTypeId: '0-1', name, value: v.trim() }))

  const text = body.lang === 'en' ? CONSENT_TEXT.en : CONSENT_TEXT.ko
  const consent = {
    consentToProcess: true, // the caller only submits when the client sent privacyAgreed === true
    text: text.process,
  }
  const subscriptionTypeId = Number(process.env.HUBSPOT_MARKETING_SUBSCRIPTION_TYPE_ID)
  if (subscriptionTypeId) {
    consent.communications = [
      {
        value: body.marketingAgreed === true,
        subscriptionTypeId,
        text: text.marketing,
      },
    ]
  }

  const context = {}
  if (typeof body.pageUri === 'string' && /^https?:\/\//.test(body.pageUri)) {
    context.pageUri = body.pageUri.slice(0, 1000)
  }
  if (typeof body.pageName === 'string') context.pageName = body.pageName.slice(0, 200)

  try {
    const hsRes = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submittedAt: Date.now(),
          fields,
          context,
          legalConsentOptions: { consent },
        }),
        signal: AbortSignal.timeout(HUBSPOT_TIMEOUT_MS),
      },
    )
    if (!hsRes.ok) {
      // Log only error types + correlation id: the body can echo submitted values (PII)
      const err = await hsRes.json().catch(() => null)
      console.error(
        'HubSpot submit failed:',
        hsRes.status,
        err?.correlationId,
        (err?.errors ?? []).map((e) => e.errorType).join(','),
      )
    }
  } catch (error) {
    console.error('HubSpot submit error:', error?.name, error?.message)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    // Vercel sets the real client IP on x-real-ip.
    // The leftmost x-forwarded-for value is client-spoofable, so we do not trust it.
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

    // Honeypot: a field hidden from humans. A value means the sender is a bot -> return success
    // silently (give the attacker no hint).
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return res.status(200).json({ success: true })
    }

    const { name, email, phone } = body

    // Type check: non-strings would throw a TypeError on .trim() -> return an explicit 400.
    if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') {
      return res.status(400).json({ error: '잘못된 요청 형식입니다.' })
    }
    // Required fields
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return res.status(400).json({ error: '필수 항목을 입력해주세요.' })
    }
    // Length limits (prevent payload abuse)
    for (const [field, max] of Object.entries(MAX_LEN)) {
      if (typeof body[field] === 'string' && body[field].length > max) {
        return res.status(400).json({ error: '입력값이 너무 깁니다.' })
      }
    }
    // Format validation (re-checked server-side in case the client check is bypassed)
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
직함: ${sanitizeForSlack(body.jobTitle) || '-'}
이메일: ${sanitizeForSlack(body.email)}
연락처: ${sanitizeForSlack(body.phone)}

문의내용:
${sanitizeForSlack(body.message) || '(내용 없음)'}

마케팅 수신 동의: ${body.marketingAgreed === true ? '동의' : '미동의'}
접수시간: ${submittedAt}
\`\`\``,
    }

    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage),
      signal: AbortSignal.timeout(5000),
    })

    if (!slackRes.ok) {
      console.error('Slack webhook failed:', slackRes.status)
      return res.status(502).json({ error: '전송 실패' })
    }

    // After Slack, so a Slack 502 + user retry doesn't double the HubSpot auto-reply.
    // Awaited because Vercel freezes the function once the response is sent; never throws.
    // Only when the client sent the required privacy consent. It is client-asserted, so this guards
    // stale/honest clients, not forgery (abuse is bounded by the rate limit; CAPTCHA is a follow-up).
    if (body.privacyAgreed === true) await submitToHubSpot(body)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return res.status(500).json({ error: '서버 오류' })
  }
}
