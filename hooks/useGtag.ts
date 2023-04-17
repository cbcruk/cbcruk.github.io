import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as gtag from '../lib/gtag'

export function useGtag() {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const handleRouteChange = (url: string) => gtag.pageview(url)

      router.events.on('routeChangeComplete', handleRouteChange)

      return () => router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
}
