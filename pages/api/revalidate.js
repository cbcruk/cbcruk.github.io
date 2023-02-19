import { getServerSession } from 'next-auth'
import { match } from 'ts-pattern'
import { authOptions } from './auth/[...nextauth]'

async function handleRevalidate(req, res) {
  try {
    await res.revalidate(req.body.urlPath)
    res.json({ revalidated: true })
  } catch (e) {
    res.status(500).end()
  }
}

/** @type {import('next').NextApiHandler} */
async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  match(session)
    .with({ user: { role: 'admin' } }, () => handleRevalidate(req, res))
    .otherwise(() => {
      res.status(401).end()
    })

  return
}

export default handler
