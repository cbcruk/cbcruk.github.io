import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Header } from './Header'

const links = [
  {
    href: '/',
    text: 'Home',
  },
  {
    href: '/about',
    text: 'About',
  },
  {
    href: '/memo',
    text: 'Memo',
    isActive(path: string) {
      return /memo|tagged\/./.test(path)
    },
  },
  {
    href: '/tagged',
    text: 'Tag',
    isActive(path: string) {
      return /^\/tagged$/.test(path)
    },
  },
]

function Nav() {
  const router = useRouter()

  return (
    <Header>
      <nav className="flex items-center gap-2 text-sm">
        {links.map((link) => {
          const hasParam = router.asPath.includes('/') && link.href.length > 1
          const isActive = link.isActive
            ? link.isActive(router.asPath)
            : hasParam
            ? router.asPath.startsWith(link.href)
            : router.asPath === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx({
                underline: isActive,
                'is-active': isActive,
              })}
            >
              {link.text}
            </Link>
          )
        })}
      </nav>
    </Header>
  )
}

export default Nav
