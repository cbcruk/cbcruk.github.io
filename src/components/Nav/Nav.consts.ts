export const MENUS = {
  home: {
    pathname: '/',
    label: 'Home',
  },
  about: {
    pathname: '/about',
    label: 'About',
  },
  memo: {
    pathname: '/memos/1',
    label: 'Memo',
  },
  tag: {
    pathname: '/tagged',
    label: 'Tag',
  },
  search: {
    pathname: '/search',
    label: 'Search',
  },
} as const
