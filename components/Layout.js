import Head from 'next/head'
import Nav from './Nav'

function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{['eunsoolee', title].join(' - ')}</title>
        <meta name="description" content="" />
      </Head>

      <Nav />

      <main className="max-w-prose p-2 mr-auto ml-auto mt-4">
        {title && <h1 className="text-lg">{title}</h1>}
        {children}
      </main>
    </>
  )
}

export default Layout
