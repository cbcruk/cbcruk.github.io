import type { Props } from '@components/Memo/MemoDate.types'
import { format } from '@formkit/tempo'

export function formatDate(date: Props['ctime' | 'mtime']) {
  return format(new Date(date), 'full', 'ko')
}
