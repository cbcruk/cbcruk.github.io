import Head from 'next/head'
import Nav from './Nav'

function Layout({ title, isShowTitle = true, children }) {
  return (
    <>
      <Head>
        <title>{['eunsoolee', title].join(' - ')}</title>
        <meta name="description" content="" />
      </Head>

      <Nav />

      <main className="max-w-prose p-4 mb-4">
        {title && isShowTitle && <h1 className="text-lg">{title}</h1>}
        {children}
      </main>
    </>
  )
}

export default Layout
