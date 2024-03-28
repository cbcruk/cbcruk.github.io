import { twc } from 'react-twc'

export const Nav = twc.nav`flex items-center gap-2 text-sm`

export const NavLink = twc.a`data-[is-active='true']:font-bold`
