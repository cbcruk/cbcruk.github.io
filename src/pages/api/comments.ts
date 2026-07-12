export const prerender = process.env.VERCEL ? false : true

import type { APIRoute } from 'astro'
import { getComments, createComment } from '@lib/comments'

// CORS 헤더는 vercel.json(/api/*)에서 주입 — search.ts와 동일 방식.
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')

  return forwarded?.split(',')[0]?.trim() || 'unknown'
}

export const OPTIONS: APIRoute = () => new Response(null, { status: 204 })

export const GET: APIRoute = async ({ request }) => {
  const memoId = new URL(request.url).searchParams.get('memoId')

  if (!memoId) {
    return json({ error: 'memoId가 필요합니다.' }, 400)
  }

  return json(await getComments(memoId))
}

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>

  try {
    payload = await request.json()
  } catch {
    return json({ error: '잘못된 요청입니다.' }, 400)
  }

  // 허니팟: 사람은 비워두는 필드. 채워져 있으면 봇으로 간주하고 조용히 성공 처리.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return json({ ok: true }, 200)
  }

  const result = await createComment({
    memoId: String(payload.memoId ?? ''),
    author: String(payload.author ?? ''),
    body: String(payload.body ?? ''),
    ip: clientIp(request),
  })

  if (!result.ok) {
    return json({ error: result.error }, result.status)
  }

  return json(result.comment, 201)
}
