// @ts-check
import clsx from 'clsx'
import { LinkButton } from './Pagination'

/**
 *
 * @param {{ className?: string }} props
 */
export function PaginationLatest({ className }) {
  return (
    <div className={clsx(className, 'flex justify-between items-center pt-8')}>
      <span className="text-neutral-400 text-xs">최근 수정한 페이지</span>
      <div className="flex justify-end items-center gap-1 ml-auto">
        <LinkButton page={1} className="">
          전체 보기
        </LinkButton>
      </div>
    </div>
  )
}
