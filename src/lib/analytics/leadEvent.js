// Pure GA4 `generate_lead` sender. Kept free of import.meta.env so node tests can
// drive it; ga.js binds the real measurement id and window.
//
// Only fixed slugs and the page URL are sent - never form values (no PII).
export function sendLeadEvent({ measurementId, win, formId, kind }) {
  if (!measurementId || !win || !win.gtag) return
  const params = { form_id: formId, page_location: win.location.href }
  if (kind) params.lead_kind = kind
  win.gtag('event', 'generate_lead', params)
}
