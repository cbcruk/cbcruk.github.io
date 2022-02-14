// @ts-check
import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '../styles/github.css'
import { Kbar } from '../components/Kbar/Kbar'

/**
 *
 * @param {import('next/app').AppProps} props
 */
function App({ Component, pageProps }) {
  return (
    <Kbar>
      <Component {...pageProps} />
    </Kbar>
  )
}

export default App
