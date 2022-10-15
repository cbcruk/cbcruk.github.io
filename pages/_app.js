// @ts-check
import 'tailwindcss/tailwind.css'
import 'highlight.js/styles/base16/tomorrow-night.css'
import '../styles/globals.css'
import '../styles/github.css'
import '../styles/solarized.css'
import { Kbar } from '../components/Kbar/Kbar'
import Analytics from '../components/Analytics'
import { useGtag } from 'hooks/useGtag'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function App({ Component, pageProps }) {
  useGtag()

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Analytics />
        <Kbar>
          <Component {...pageProps} />
        </Kbar>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default App
