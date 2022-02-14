// @ts-check
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

/**
 *
 * @param {string} time
 */
export function day(time) {
  return dayjs(time)
}

/**
 *
 * @param {string} time
 */
export function fromNow(time) {
  return day(time).fromNow()
}
