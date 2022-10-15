import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

function useAdmin() {
  const { data: session } = useSession()
  const isAdmin = session?.user.role === 'admin'

  return {
    isAdmin,
  }
}

function useId({ id }) {
  const router = useRouter()
  const isItemPage = Boolean(router.query.id)
  const shortId = `#${id.slice(0, 7)}`

  return {
    isItemPage,
    shortId,
  }
}

export function MemoFooter({ id, lastModified }) {
  const { isItemPage, shortId } = useId({ id })
  const { isAdmin } = useAdmin()

  return (
    <div className="p-4 pt-0 text-[10px] text-[color:var(--solarized-base01)]">
      {(() => {
        if (isAdmin && isItemPage)
          return (
            <a
              href={`https://airtable.com/appA3uy3I630eFjkv/tblLjcqoMDcKxyXe9/viwXvEtUspUWkPUrO/${id}?blocks=hide`}
              target="_blank"
              rel="noreferrer"
            >
              #{id}
            </a>
          )

        if (isItemPage) {
          return `#${id}`
        }

        return (
          <Link href={`/memo/item/${id}`}>
            <a>{shortId}</a>
          </Link>
        )
      })()}{' '}
      modified on {new Date(lastModified).toLocaleDateString('ko-KR')}
    </div>
  )
}
