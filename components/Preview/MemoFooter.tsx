import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { MemoRecord } from '@/lib/types'

function useAdmin() {
  const { data: session } = useSession()
  const isAdmin = session?.user.role === 'admin'

  return {
    isAdmin,
  }
}

type UseIdParams = {
  id: MemoRecord['id']
}

function useId({ id }: UseIdParams) {
  const router = useRouter()
  const isItemPage = Boolean(router.query.id)
  const shortId = `#${id.slice(0, 7)}`

  return {
    isItemPage,
    shortId,
  }
}

type Props = {
  id: MemoRecord['id']
  lastModified: MemoRecord['fields']['lastModified']
}

export function MemoFooter({ id, lastModified }: Props) {
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

        return <Link href={`/memo/item/${id}`}>{shortId}</Link>
      })()}{' '}
      modified on {new Date(lastModified).toLocaleDateString('ko-KR')}
    </div>
  )
}
