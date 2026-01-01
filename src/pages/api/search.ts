export const prerender = process.env.VERCEL ? false : true

import Fuse from 'fuse.js'
import { getReleaseMemoCollection } from '@collection/memo'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  if (!q) {
    return new Response(null, {
      status: 400,
    })
  }

  const memoCollection = await getReleaseMemoCollection()

  const fuse = new Fuse(memoCollection, {
    keys: [
      { name: 'data.tags', weight: 2 },
      { name: 'data.title', weight: 1.5 },
      { name: 'data.description', weight: 1.2 },
      { name: 'body', weight: 1 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
  })

  const result = fuse.search(q).map(({ item, score }) => ({
    ...item,
    score,
  }))

  return Response.json(result, { status: 200 })
}
