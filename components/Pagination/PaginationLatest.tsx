import clsx from 'clsx'
import { LinkButton } from './Pagination'

type Props = JSX.IntrinsicElements['div']

export function PaginationLatest({ className }: Props) {
  return (
    <div className={clsx(className, 'flex justify-between items-center pt-8')}>
      <span className="text-neutral-400 text-xs">최근 수정한 페이지</span>
      <div className="flex justify-end items-center gap-1 ml-auto">
        <LinkButton href="/memo/1">전체 보기</LinkButton>
      </div>
    </div>
  )
}
