// @ts-check
import { useEffect } from 'react'

function useNewWindow() {
  useEffect(() => {
    document.querySelectorAll('a[rel="nofollow"]').forEach((a) => {
      a.setAttribute('target', '_blank')
    })
  }, [])
}

export default useNewWindow
