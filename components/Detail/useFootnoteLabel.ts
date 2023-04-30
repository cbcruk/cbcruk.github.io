import { MouseEvent, useCallback } from 'react'

const ACTIVE_CLASSNAME = 'is-active'
const ARIA_LABEL = 'footnote-label'

function useFootnoteLabel() {
  const handler = useCallback((e: MouseEvent) => {
    const target = e.currentTarget
    const hasFootnoteLabel =
      target.getAttribute('aria-describedby') === ARIA_LABEL

    if (hasFootnoteLabel) {
      e.preventDefault()

      document
        .querySelector(`.${ACTIVE_CLASSNAME}`)
        ?.classList.remove(ACTIVE_CLASSNAME)

      const href = target.getAttribute('href')

      if (href) {
        document.querySelector(href)?.classList.add(ACTIVE_CLASSNAME)
      }
    }
  }, [])

  return handler
}

export default useFootnoteLabel
