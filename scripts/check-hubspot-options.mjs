// Fails the build when a sample-form option has no HubSpot value.
//
// The sample forms (src/components/data/RequestBlocks.jsx) send the label the visitor saw, and
// api/_hubspotSample.js maps it to the HubSpot property's internal value. Renaming an option in
// src/data/dataMarket.{ko,en}.js without updating that map would silently stop the answer from
// being saved in HubSpot, so the build checks every label in both languages here.
import { KO } from '../src/data/dataMarket.ko.js'
import { EN } from '../src/data/dataMarket.en.js'
import { SAMPLE_OPTION_VALUES } from '../api/_hubspotSample.js'

// What the form offers, built the way SampleForm builds it (EN falls back to KO when absent).
function options(L) {
  const f = L.request?.form ?? {}
  const fb = KO.request.form
  return {
    collections: [...(L.collections ?? KO.collections).map((c) => c.name), ...(f.collections ?? fb.collections)],
    model: f.models ?? fb.models,
    volume: f.volumes ?? fb.volumes,
    license: f.licenses ?? fb.licenses,
    timeline: f.timelines ?? fb.timelines,
  }
}

const problems = []
for (const [lang, L] of [['ko', KO], ['en', EN]]) {
  for (const [kind, labels] of Object.entries(options(L))) {
    const known = new Set(Object.values(SAMPLE_OPTION_VALUES[kind]).flat())
    for (const label of labels) {
      if (!known.has(label)) problems.push(`${lang} ${kind}: "${label}"`)
    }
  }
}

if (problems.length) {
  console.error('[check-hubspot-options] sample-form options with no HubSpot value:')
  for (const p of problems) console.error(`  - ${p}`)
  console.error('Add each label to SAMPLE_OPTION_VALUES in api/_hubspotSample.js (ask sales for the value).')
  process.exit(1)
}
console.log('[check-hubspot-options] every sample-form option maps to a HubSpot value')
