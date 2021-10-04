import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
  },
]

function Nav() {
  const router = useRouter()

  return (
    <div className="sticky top-0 p-4 bg-gray-700">
      <nav className="flex items-center gap-2 text-sm">
        {links.map((link) => {
          const hasParam = router.asPath.includes('/') && link.href.length > 1
          const isActive = hasParam
            ? router.asPath.startsWith(link.href)
            : router.asPath === link.href
          return (
            <Link key={link.href} href={link.href}>
              <a
                className={clsx({
                  underline: isActive,
                  'is-active': isActive,
                })}
              >
                {link.text}
              </a>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Nav
