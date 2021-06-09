import Head from 'next/head'
import Nav from './Nav'

function Layout({ title, children }) {
  return (
    <div className="p-2">
      <Head>
        <title>eunsoolee</title>
        <meta name="description" content="" />
      </Head>

      <Nav />

      <main className="mt-4">
        {title && <h1 className="text-lg">{title}</h1>}
        {children}
      </main>
    </div>
  )
}

export default Layout
