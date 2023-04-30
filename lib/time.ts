import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function day(time: string) {
  return dayjs(time)
}

export function fromNow(time: string) {
  return day(time).fromNow()
}
