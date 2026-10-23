import { useEffect, useState } from 'react'

let ready = false

// False while rendering on the server and during the hydration pass, true from
// the first committed effect on. Use it to keep browser-only output (lazy
// chunks, the current date, random numbers) out of the prerendered markup so
// hydration sees the same tree. Components mounted after hydration (client
// navigation) get true immediately.
export function useClientReady() {
  const [value, setValue] = useState(ready)
  useEffect(() => {
    ready = true
    setValue(true)
  }, [])
  return value
}
