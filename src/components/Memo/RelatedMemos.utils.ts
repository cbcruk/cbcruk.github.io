const MAX_LENGTH = 64

const clean = (line: string): string =>
  line
    .replace(/^#+\s*/, '')
    .replace(/^>\s*/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()

const truncate = (text: string): string =>
  text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH)}…` : text

export const getExcerpt = (body: string | undefined): string => {
  if (!body) {
    return ''
  }

  let insideFence = false
  let prose = ''
  let fallback = ''

  for (const raw of body.split('\n')) {
    const line = raw.trim()

    if (line.startsWith('```')) {
      insideFence = !insideFence
      continue
    }

    if (
      line.length === 0 ||
      line.startsWith('---') ||
      line.startsWith('|') ||
      /^\[\^/.test(line)
    ) {
      continue
    }

    if (!fallback) {
      fallback = clean(line)
    }

    if (!insideFence && !line.startsWith('<')) {
      prose = clean(line)

      if (prose.length > 0) {
        break
      }
    }
  }

  return truncate(prose || fallback)
}
