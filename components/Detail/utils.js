export function getHtml(html) {
  return html
    .replace(/\[CODEPEN=(.+)\]/g, (_match, p1) => {
      return `<iframe src="https://codepen.io/eunsoolee/embed/${p1}?default-tab=result" loading="lazy"></iframe>`
    })
    .replace(/\[CODESANDBOX=(.+)\]/g, (_match, p1) => {
      return `<iframe src="https://codesandbox.io/embed/${p1}?fontsize=14&theme=dark&view=preview"></iframe>`
    })
}
