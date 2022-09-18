// @ts-check
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

      <main className="max-w-3xl p-4 mb-4 mx-auto">
        {title && isShowTitle && <Title>{title}</Title>}
        {children}
      </main>
    </>
  )
}

export default Layout
