import { useEffect, useLayoutEffect } from 'react'

// useLayoutEffect warns during server rendering; the effect itself only matters
// in the browser, so fall back to useEffect where there is no DOM.
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
