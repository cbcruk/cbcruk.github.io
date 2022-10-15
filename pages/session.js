import { useSession, signIn, signOut } from 'next-auth/react'

function Session() {
  const { data: session } = useSession()

  return (
    <div className="p-4 text-xs">
      {(() => {
        if (session) {
          return (
            <>
              Signed in as {session.user.email} <br />
              <button onClick={() => signOut()} className={styles.button}>
                Sign out
              </button>
            </>
          )
        }

        return (
          <>
            Not signed in <br />
            <button onClick={() => signIn()} className={styles.button}>
              Sign in
            </button>
          </>
        )
      })()}
    </div>
  )
}

const styles = {
  button:
    'font-bold bg-[color:var(--solarized-background-highlight)] p-2 rounded-lg mt-2 text-[color:var(--solarized-violet)]',
}

export default Session
