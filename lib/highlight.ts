import hljs from 'highlight.js'

hljs.configure({
  ignoreUnescapedHTML: true,
  throwUnescapedHTML: false,
})

export const highlightElement = hljs.highlightElement
