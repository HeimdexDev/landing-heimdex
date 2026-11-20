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
  lintHeadWiring,
  lintVercel,
  unparsedRoutes,
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

test('R5: catch-all redirect, trailingSlash, cleanUrls are rejected', () => {
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

test('K1: slash-less rewrite destination must be the language shell', () => {
  const v = vercel()
  v.rewrites.find((r) => r.source === '/blog').destination = '/index.html'
  v.rewrites.find((r) => r.source === '/en/blog').destination = '/_shell.html'
  const out = lintReachability(routes(), v).join()
  assert.match(out, /\/blog -> \/index.html/)
  assert.match(out, /\/en\/blog -> \/_shell.html/)
})

test('K6: rewrites outside the expected set fail', () => {
  const v = vercel()
  v.rewrites.push({ source: '/nope', destination: '/_shell.html' })
  assert.match(lintReachability(routes(), v).join(), /unexpected rewrite \/nope/)
})

test('K6: Route path forms the scan cannot read are reported', () => {
  assert.deepEqual(unparsedRoutes(app), [])
  assert.deepEqual(unparsedRoutes(app + '\n<Route path="/newpage" element={null} />'), ['"/newpage"'])
  assert.equal(unparsedRoutes(app + '\n<Route path={`${p}${x}`} element={null} />').length, 1)
})

test('K3: RouteMeta and SeoLinks must apply headFor and App must mount both', () => {
  const files = () => ({
    routeMeta: read('../src/seo/RouteMeta.jsx'),
    seoLinks: read('../src/i18n/SeoLinks.jsx'),
    app,
  })
  assert.deepEqual(lintHeadWiring(files()), [])
  const f = files()
  f.routeMeta = f.routeMeta.replace('headFor(pathname)', 'metaFor(pathname)')
  assert.match(lintHeadWiring(f).join(), /RouteMeta.jsx does not call headFor/)
  const g = files()
  g.seoLinks = g.seoLinks.replace('.remove()', '.hidden = true')
  assert.match(lintHeadWiring(g).join(), /SeoLinks.jsx never removes/)
  const h = files()
  h.app = h.app.replace('<SeoLinks />', '').replace('<RouteMeta />', '')
  assert.match(lintHeadWiring(h).join(), /App.jsx does not mount <SeoLinks \/>/)
  assert.match(lintHeadWiring(h).join(), /App.jsx does not mount <RouteMeta \/>/)
})

test('K7: build config rejects headers', () => {
  assert.match(lintVercel({ ...vercel(), headers: [] }, exists).join(), /"headers"/)
})
