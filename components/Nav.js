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
    href: '/projects',
    text: 'Projects',
  },
  {
    href: '/memo',
    text: 'Memo',
  },
]

function Nav() {
  const router = useRouter()

  return (
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
  )
}

export default Nav
