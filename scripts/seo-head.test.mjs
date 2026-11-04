// Run: npm test (or node --test scripts/*.test.mjs)
// Loads the real src/seo modules through vite and feeds them the path lists the build
// check uses, plus mutated copies of isNotFoundPath, to prove each rule fires.
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { lintHead, JUNK_PATHS, EXTRA_REAL_PATHS } from './soft-404-rules.mjs'

let vite, head, notFound, meta
before(async () => {
  vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
  head = await vite.ssrLoadModule('/src/seo/head.js')
  notFound = await vite.ssrLoadModule('/src/seo/notFound.js')
  meta = await vite.ssrLoadModule('/src/seo/meta.js')
})
after(() => vite.close())

const real = () => [...meta.PRERENDER_PATHS, ...EXTRA_REAL_PATHS]
const run = (isNotFoundPath) => lintHead({ headFor: head.headFor, isNotFoundPath }, real(), JUNK_PATHS)

test('K1/K2/K5/K8: real routes keep their head, junk stays 404, case and slash are normalised', () => {
  assert.deepEqual(run(notFound.isNotFoundPath), [])
})

test('K4: dropping a real route family from the 404 gate is caught', () => {
  for (const dropped of ['/contact', '/cases', '/data', '/request', '/product', '/policy']) {
    const mutated = (p) => notFound.isNotFoundPath(p) || p.replace(/^\/en(?=\/|$)/, '').startsWith(dropped)
    assert.ok(run(mutated).length > 0, `${dropped} not caught`)
  }
})

test('K2: the old prefix gate is caught', () => {
  const prefixGate = (p) => {
    const b = p.replace(/^\/en(?=\/|$)/, '').replace(/^\/ko(?=\/|$)/, '') || '/'
    return b !== '/' && b !== '/blog' && !['/product', '/contact', '/policy', '/cases', '/heimlog', '/data', '/request'].some((s) => b.startsWith(s))
  }
  assert.match(run(prefixGate).join(), /\/cases\/nope/)
})
