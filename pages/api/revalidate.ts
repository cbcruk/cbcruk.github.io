import { getServerSession } from 'next-auth'
import { match } from 'ts-pattern'
import { authOptions } from './auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'

async function handleRevalidate(req: NextApiRequest, res: NextApiResponse) {
  try {
    await res.revalidate(req.body.urlPath)
    res.json({ revalidated: true })
  } catch (e) {
    res.status(500).end()
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  match(session)
    .with({ user: { role: 'admin' } }, () => handleRevalidate(req, res))
    .otherwise(() => {
      res.status(401).end()
    })

  return
}

export default handler
