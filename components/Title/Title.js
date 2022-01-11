import clsx from 'clsx'

export function Title({ children }) {
  return <h1 className={clsx(['text-lg'])}>
    {children}
  </h1>
}
