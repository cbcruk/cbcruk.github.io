import { getReleaseMemoCollection } from '@collection/memo'
import type { APIRoute } from 'astro'

const memos = await getReleaseMemoCollection()

export const GET: APIRoute = async ({ site }) => {
  return new Response(
    `<SYSTEM>이 문서는 개발관련 메모 모음입니다.</SYSTEM>

# 문서 시작하기

${memos
  .map((memo) => {
    const url = new URL(memo.id, site)

    return `# [${memo.id}](${url.href}/)

## 설명

${memo.body}  

`
  })
  .join('')}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
