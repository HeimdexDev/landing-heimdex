// Site-wide on/off switches for sections that are built but not shown yet.
// Flip a flag back to true to bring the section back — nothing else to undo.

// 회사 (소개 · 소식 · 브랜드 · 채용) everywhere: the GNB 회사 dropdown, the footer
// column, the mobile menu, and the /company/* pages themselves (they 404 while off
// and are left out of the prerender + sitemap). The page code stays in place.
export const SHOW_COMPANY_LINKS = false
