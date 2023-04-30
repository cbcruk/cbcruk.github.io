import { MemoPageProps } from '@/lib/types'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentProps } from 'react'

type LinkButtonProps = ComponentProps<typeof Link>

export function LinkButton({ href, className, children }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex justify-center p-1 px-2 rounded-full border border-transparent hover:border-sky-900 text-xs text-center bg-sky-900/30 hover:bg-sky-900/60',
        className
      )}
    >
      {children}
    </Link>
  )
}

type PaginationProps = {
  pagination: MemoPageProps['data']['pagination']
} & JSX.IntrinsicElements['div']

export function Pagination({ className, pagination = [] }: PaginationProps) {
  const router = useRouter()
  const current = router.query?.page ?? 1
  const [prev, next, total] = pagination

  return (
    <div className={clsx(className, 'flex justify-between items-center pt-8')}>
      {total && (
        <span className="text-neutral-400 text-xs">
          {`${total} 중 ${current}페이지`}
        </span>
      )}
      <div className="flex justify-end items-center gap-1 ml-auto">
        {prev !== 0 && (
          <LinkButton href={`/memo/${prev}`}>이전 페이지</LinkButton>
        )}
        {current !== `${total}` && (
          <LinkButton href={`/memo/${next}`}>다음 페이지</LinkButton>
        )}
      </div>
    </div>
  )
}
