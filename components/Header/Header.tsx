import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function Header({ children }: Props) {
  return (
    <div className="flex justify-between sticky top-0 z-10 p-4 bg-[color:var(--solarized-background-highlight)] text-[color:var(--solarized-emphasized)]">
      {children}
    </div>
  )
}

export default Header
