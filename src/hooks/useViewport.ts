import { useEffect, useState } from 'react'

export function useViewport() {
  const [size, setSize] = useState({
    vw: typeof window !== 'undefined' ? (window.visualViewport?.width ?? window.innerWidth) : 1024,
    vh: typeof window !== 'undefined' ? (window.visualViewport?.height ?? window.innerHeight) : 768,
  })

  useEffect(() => {
    const update = () => {
      setSize({
        vw: window.visualViewport?.width ?? window.innerWidth,
        vh: window.visualViewport?.height ?? window.innerHeight,
      })
    }
    const vv = window.visualViewport
    vv?.addEventListener('resize', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      vv?.removeEventListener('resize', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return size
}
