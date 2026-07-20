import { Link as RouterLink } from 'react-router-dom'
import { useLang, localizePath } from './LanguageContext.jsx'

// Drop-in replacement for react-router's Link. Call sites keep writing the
// canonical (Korean) path — this adds the /en prefix while browsing in English
// so navigation never silently drops you back into the other language.
export default function Link({ to, ...rest }) {
  const { lang } = useLang()
  return <RouterLink to={localizePath(to, lang)} {...rest} />
}

export { Link }
