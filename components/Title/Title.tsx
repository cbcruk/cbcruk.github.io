import clsx from 'clsx'

type Props = JSX.IntrinsicElements['h1']

export function Title({ children }: Props) {
  return <h1 className={clsx(['text-lg'])}>{children}</h1>
}
