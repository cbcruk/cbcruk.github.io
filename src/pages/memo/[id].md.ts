import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { APIRoute, GetStaticPaths } from 'astro'
import { getReleaseMemoCollection } from '@collection/memo'

export const prerender = true

export const getStaticPaths: GetStaticPaths = async () => {
  const memos = await getReleaseMemoCollection()

  return memos.map((memo) => ({
    params: { id: memo.id },
    props: { filePath: memo.filePath },
  }))
}

// 원본 파일을 그대로 넘긴다 — frontmatter 포함이 raw의 의미
export const GET: APIRoute = async ({ props }) => {
  const raw = await readFile(resolve(props.filePath), 'utf-8')

  return new Response(raw, {
    // text/markdown은 브라우저가 내려받는다. 눌러서 바로 읽히는 게 목적
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
