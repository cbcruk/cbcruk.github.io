import { Button } from 'components/Form/Button'
import { useSession, signIn, signOut } from 'next-auth/react'
import { match, P } from 'ts-pattern'

function SessionDesc({ children }) {
  return <p>{children}</p>
}

function Session() {
  const { data: session } = useSession()

  return (
    <div className="p-4 text-xs">
      {match(session)
        .with({ user: { email: P.not(P.nullish) } }, () => {
          return (
            <SessionDesc>
              Signed in as {session.user.email} <br />
              <Button onClick={() => signOut()}>Sign out</Button>
            </SessionDesc>
          )
        })
        .otherwise(() => {
          return (
            <SessionDesc>
              Not signed in <br />
              <Button onClick={() => signIn()}>Sign in</Button>
            </SessionDesc>
          )
        })}
    </div>
  )
}

export default Session
