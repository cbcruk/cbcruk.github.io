// @ts-check
export const DEFAULT_ACTIONS = {
  home: {
    id: 'home',
    name: 'Home',
    shortcut: ['h'],
  },
  about: {
    id: 'about',
    name: 'About',
    shortcut: ['a'],
  },
  memo: {
    id: 'memo',
    name: 'Memo',
    shortcut: ['m'],
  },
}

export const actions = ({ onPerform }) => {
  /**
   * @type {import('kbar').KBarProviderProps['actions']}
   */
  const items = [
    {
      ...DEFAULT_ACTIONS['home'],
      perform: () => onPerform('/'),
    },
    {
      ...DEFAULT_ACTIONS['about'],
      perform: () => onPerform('/about'),
    },
    {
      ...DEFAULT_ACTIONS['memo'],
      perform: () => onPerform('/memo'),
    },
  ]

  return items
}
