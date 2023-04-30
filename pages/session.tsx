import { Button } from '@/components/Form/Button'
import { useSession, signIn, signOut } from 'next-auth/react'
import Head from 'next/head'
import { match } from 'ts-pattern'

function Session() {
  const session = useSession()

  return (
    <>
      <Head>
        <title>{['세션', 'eunsoolee'].join(' | ')}</title>
      </Head>
      <div className="p-4 text-xs">
        {match(session)
          .with({ status: 'loading' }, () => <p>`loading`</p>)
          .with({ status: 'authenticated' }, ({ data: { user } }) => (
            <p>
              Signed in as {user?.email} <br />
              <Button onClick={() => signOut()}>Sign out</Button>
            </p>
          ))
          .with({ status: 'unauthenticated' }, () => (
            <p>
              Not signed in <br />
              <Button onClick={() => signIn()}>Sign in</Button>
            </p>
          ))
          .otherwise(() => null)}
      </div>
    </>
  )
}

export default Session
