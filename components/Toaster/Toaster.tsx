import { Toaster as ReactHotToaster } from 'react-hot-toast'

const DEFAULT_STYLE = {
  backgroundColor: 'var(--solarized-background-highlight)',
  color: 'var(--solarized-primary)',
}

export function Toaster() {
  return (
    <ReactHotToaster
      toastOptions={{
        className: 'text-xs',
        style: DEFAULT_STYLE,
      }}
    />
  )
}
