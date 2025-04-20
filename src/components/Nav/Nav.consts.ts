export const MENUS = {
  home: {
    pathname: '/',
    label: '홈',
  },
  about: {
    pathname: '/about',
    label: '소개',
  },
  memo: {
    pathname: '/memos/1',
    label: '메모',
  },
  think: {
    pathname: '/thinks/1',
    label: '생각',
  },
  tag: {
    pathname: '/tagged',
    label: '태그',
  },
  search: {
    pathname: '/search',
    label: '검색',
  },
} as const
