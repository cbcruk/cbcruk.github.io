import Head from 'next/head'
import Nav from './Nav'
import { Title } from './Title'

function Layout({ title, isShowTitle = true, children }) {
  return (
    <>
      <Head>
        <title>{['eunsoolee', title].join(' - ')}</title>
        <meta name="description" content="" />
      </Head>

      <Nav />

      <main className="max-w-prose p-4 mb-4">
        {title && isShowTitle && <Title className="text-lg">{title}</Title>}
        {children}
      </main>
    </>
  )
}

export default Layout
