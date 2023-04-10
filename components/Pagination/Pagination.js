// @ts-check
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function LinkButton({ page, className, children }) {
  return (
    <Link
      href={`/memo/${page}`}
      className={clsx(
        'inline-flex justify-center p-1 px-2 rounded-full border border-transparent hover:border-sky-900 text-xs text-center bg-sky-900/30 hover:bg-sky-900/60',
        className
      )}
    >
      {children}
    </Link>
  )
}

/**
 *
 * @param {{ className?: string, pagination: number[] }} props
 */
export function Pagination({ className, pagination = [] }) {
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
          <LinkButton page={prev} className="">
            이전 페이지
          </LinkButton>
        )}
        {current !== `${total}` && (
          <LinkButton page={next} className="">
            다음 페이지
          </LinkButton>
        )}
      </div>
    </div>
  )
}
