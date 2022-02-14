// @ts-check
import { useCallback } from 'react'

const ACTIVE_CLASSNAME = 'is-active'
const ARIA_LABEL = 'footnote-label'

function useFootnoteLabel() {
  const handler = useCallback((e) => {
    const target = e.target
    const hasFootnoteLabel =
      target.getAttribute('aria-describedby') === ARIA_LABEL

    if (hasFootnoteLabel) {
      e.preventDefault()

      const href = target.getAttribute('href')

      document
        .querySelector(`.${ACTIVE_CLASSNAME}`)
        .classList.remove(ACTIVE_CLASSNAME)
      document.querySelector(href).classList.add(ACTIVE_CLASSNAME)
    }
  }, [])

  return handler
}

export default useFootnoteLabel
