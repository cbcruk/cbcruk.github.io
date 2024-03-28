import type { Props } from './MemoModified.types'

export function getLocaleDateString(date: Props['date']) {
  return new Date(date).toLocaleDateString('ko-KR')
}
