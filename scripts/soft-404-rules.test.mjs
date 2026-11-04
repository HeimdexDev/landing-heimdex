// Run: node --test scripts/
// Each case mutates a known-good config and expects the rule to fire.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  clientOnlyRoutes,
  lintParity,
  lintReachability,
  lintRedirects,
  lintVercel,
} from './soft-404-rules.mjs'

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8')
const vercel = () => JSON.parse(read('../vercel.json'))
const redirects = () => read('../public/_redirects')
const app = read('../src/App.jsx')
const exists = () => true
const prerendered = ['/', '/product', '/cases', '/contact', '/policy', '/data', '/request', '/request/done']
const routes = () => clientOnlyRoutes(app, prerendered, false)

test('repo config is clean', () => {
  assert.deepEqual(routes(), ['/heimlog', '/blog'])
  assert.deepEqual(lintVercel(vercel(), exists), [])
  assert.deepEqual(lintRedirects(redirects()), [])
  assert.deepEqual(lintParity(vercel(), redirects()), [])
  assert.deepEqual(lintReachability(routes(), vercel()), [])
})

test('R4: deleting a rewrite fails reachability', () => {
  const v = vercel()
  v.rewrites = v.rewrites.filter((r) => r.source !== '/heimlog')
  assert.match(lintReachability(routes(), v).join(), /no rewrite for \/heimlog;/)
  v.rewrites = []
  assert.equal(lintReachability(routes(), v).length, 8)
})

test('R4: a route with neither prerender nor rewrite is found', () => {
  const extra = app + '\n<Route path={`${p}/newpage`} element={null} />'
  assert.ok(clientOnlyRoutes(extra, prerendered, false).includes('/newpage'))
})

test('R3: trailing-slash sources are required', () => {
  const v = vercel()
  v.rewrites = v.rewrites.filter((r) => !r.source.endsWith('/'))
  assert.equal(lintReachability(routes(), v).length, 4)
})

test('R5: catch-all redirect, trailingSlash, cleanUrls, headers are rejected', () => {
  assert.match(lintVercel({ ...vercel(), redirects: [{ source: '/(.*)', destination: '/' }] }, exists).join(), /pattern redirect/)
  assert.match(lintVercel({ ...vercel(), trailingSlash: true }, exists).join(), /"trailingSlash"/)
  assert.match(lintVercel({ ...vercel(), cleanUrls: true }, exists).join(), /"cleanUrls"/)
  assert.deepEqual(lintVercel({ ...vercel(), redirects: [{ source: '/old', destination: '/new' }] }, exists), [])
})

test('R7: forced and pattern lines in _redirects are rejected', () => {
  assert.match(lintRedirects(redirects() + '\n/* /x 200!').join(), /pattern source \/\*/)
  assert.match(lintRedirects(redirects() + '\n/blog /_shell.html 200!').join(), /forced/)
  assert.match(lintRedirects(redirects() + '\n/:a /x 200').join(), /pattern source \/:a/)
})

test('R7: sources must match between vercel.json and _redirects', () => {
  assert.match(lintParity(vercel(), redirects() + '\n/extra /_shell.html 200').join(), /vercel.json lacks "\/extra/)
  const v = vercel()
  v.rewrites.pop()
  assert.match(lintParity(v, redirects()).join(), /vercel.json lacks ".*" that public\/_redirects has/)
})
