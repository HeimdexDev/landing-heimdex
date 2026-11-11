import test from 'node:test'
import assert from 'node:assert/strict'
import { sendLeadEvent } from '../src/lib/analytics/leadEvent.js'

const mkWin = () => {
  const calls = []
  return { calls, gtag: (...a) => calls.push(a), location: { href: 'https://heimdex.co/request' } }
}

test('no-op without measurement id', () => {
  const win = mkWin()
  sendLeadEvent({ measurementId: undefined, win, formId: 'contact' })
  assert.equal(win.calls.length, 0)
})

test('no-op without gtag or window', () => {
  sendLeadEvent({ measurementId: 'G-X', win: undefined, formId: 'contact' })
  sendLeadEvent({ measurementId: 'G-X', win: { location: { href: 'x' } }, formId: 'contact' })
})

test('sends exactly one generate_lead with expected params', () => {
  const win = mkWin()
  sendLeadEvent({ measurementId: 'G-X', win, formId: 'data_sample', kind: 'sample' })
  assert.deepEqual(win.calls, [
    ['event', 'generate_lead', { form_id: 'data_sample', lead_kind: 'sample', page_location: 'https://heimdex.co/request' }],
  ])
})

test('omits lead_kind when no kind', () => {
  const win = mkWin()
  sendLeadEvent({ measurementId: 'G-X', win, formId: 'contact' })
  assert.deepEqual(Object.keys(win.calls[0][2]).sort(), ['form_id', 'page_location'])
})

test('carries no PII keys', () => {
  const win = mkWin()
  sendLeadEvent({ measurementId: 'G-X', win, formId: 'contact', kind: 'demo', name: 'a', email: 'b@c.d', phone: '1', company: 'x', message: 'm' })
  const keys = Object.keys(win.calls[0][2])
  for (const k of ['name', 'email', 'phone', 'company', 'message']) assert.ok(!keys.includes(k))
})
