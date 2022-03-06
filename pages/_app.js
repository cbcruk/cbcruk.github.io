// @ts-check
import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '../styles/github.css'
import { Kbar } from '../components/Kbar/Kbar'
import Analytics from '../components/Analytics'
import { useGtag } from 'hooks/useGtag'

/**
 *
 * @param {import('next/app').AppProps} props
 */
function App({ Component, pageProps }) {
  useGtag()

  return (
    <>
      <Analytics />
      <Kbar>
        <Component {...pageProps} />
      </Kbar>
    </>
  )
}

export default App
