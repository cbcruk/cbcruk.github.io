import Link from 'next/link'

export function Layout({ children }: JSX.IntrinsicElements['div']) {
  return <div className="p-4 text-xs">{children}</div>
}

function Admin() {
  return (
    <Layout>
      <nav className="flex gap-2">
        <Link href="/admin/revalidate">revalidate</Link>
        <Link href="/admin/links">links</Link>
      </nav>
    </Layout>
  )
}

export default Admin
