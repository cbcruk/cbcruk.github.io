import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function day(time) {
  return dayjs(time)
}

export function fromNow(time) {
  return day(time).fromNow()
}
