import { MENUS } from './Nav.consts'
import type { Props } from './Nav.types'
import { Nav as NavPrimitive, NavLink } from './NavPrimitive'
import { isMatched } from '@components/Nav/Nav.utils'

export function Nav({ pathname }: Props) {
  const isMatch = isMatched(pathname)

  return (
    <NavPrimitive>
      <NavLink
        href={MENUS.home.pathname}
        data-is-active={isMatch([MENUS.home.pathname])}
      >
        {MENUS.home.label}
      </NavLink>
      <NavLink
        href={MENUS.about.pathname}
        data-is-active={isMatch([MENUS.about.pathname])}
      >
        {MENUS.about.label}
      </NavLink>
      <NavLink
        href={MENUS.memo.pathname}
        data-is-active={isMatch(['/memo/:id?', '/memos/:page'])}
      >
        {MENUS.memo.label}
      </NavLink>
      <NavLink
        href={MENUS.search.pathname}
        data-is-active={isMatch([MENUS.search.pathname, '/tagged/:tag?'])}
      >
        {MENUS.search.label}
      </NavLink>
    </NavPrimitive>
  )
}
