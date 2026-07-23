// Vercel Serverless Function — capture 2Checkout IPN/webhook deliveries and log them.
// Answers the URL-validation GET with 200 and logs any POST body so we can confirm whether
// 2Checkout actually delivers IPNs to this domain. Temporary diagnostic endpoint.
export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('[2CO-IPN] POST arrived:', JSON.stringify(req.body))
  } else {
    console.log('[2CO-IPN] GET validation arrived')
  }
  res.status(200).send('OK')
}
