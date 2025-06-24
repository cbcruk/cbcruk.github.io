export const prerender = process.env.VERCEL ? false : true

import { getReleaseMemoCollection } from '@collection/memo'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const memoCollection = await getReleaseMemoCollection()

  if (!q) {
    return new Response(null, {
      status: 400,
    })
  }

  const result = memoCollection.filter((memo) => memo.body?.includes(q))

  return Response.json(result, { status: 200 })
}
