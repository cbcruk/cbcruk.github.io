// Satteri HAST plugin: GitHub-style blockquote alerts (> [!NOTE] ...).
// Rewrites a matching <blockquote> into <div class="markdown-alert markdown-alert-{type}">,
// stripping the [!TYPE] marker. Styling lives in src/styles/global.css (.markdown-alert*).
// The title/icon is omitted on purpose — global.css hides .markdown-alert-title.

const ALERT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i

export function satteriGithubAlert() {
  return {
    name: 'github-alert',
    element: {
      filter: ['blockquote'],
      visit(node) {
        const children = node.children ?? []
        const pIndex = children.findIndex(
          (c) => c.type === 'element' && c.tagName === 'p',
        )
        if (pIndex === -1) return

        const p = children[pIndex]
        const firstText = p.children?.[0]
        if (!firstText || firstText.type !== 'text') return

        const match = firstText.value.match(ALERT)
        if (!match) return
        const type = match[1].toLowerCase()

        // strip the [!TYPE] marker (and the soft break that follows it)
        const stripped = firstText.value.replace(ALERT, '').replace(/^\s*\n?/, '')
        const isMarkerOnly = stripped.trim() === '' && p.children.length === 1

        const newChildren = isMarkerOnly
          ? children.filter((_, i) => i !== pIndex)
          : children.map((c, i) =>
              i === pIndex
                ? {
                    ...p,
                    children: [
                      { type: 'text', value: stripped },
                      ...p.children.slice(1),
                    ],
                  }
                : c,
            )

        return {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['markdown-alert', `markdown-alert-${type}`],
            dir: 'auto',
          },
          children: newChildren,
        }
      },
    },
  }
}
