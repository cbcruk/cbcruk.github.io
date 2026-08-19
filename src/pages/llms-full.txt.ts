import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { getReleaseMemoCollection } from '@collection/memo'
import type { APIRoute } from 'astro'

const memos = await getReleaseMemoCollection()

// 원본 파일을 그대로 넘긴다 — frontmatter 가 출처·검증을 담는다.
// /memo/[id].md 와 같은 원칙: 소비자가 받는 것은 문서 전체다.
const read = async (filePath: string) =>
  (await readFile(resolve(filePath), 'utf-8')).trim()

export const GET: APIRoute = async ({ site }) => {
  const documents = await Promise.all(
    memos.map(async (memo) => {
      const url = new URL(memo.id, site)
      return `# [${memo.id}](${url.href}/)\n\n${await read(memo.filePath)}\n`
    })
  )

  return new Response(
    `<SYSTEM>이 문서는 개발관련 메모 모음입니다.

각 문서는 YAML frontmatter 로 시작합니다. OKF(Open Knowledge Format) 필드의 의미:

- generated: { by, at } — 이 본문을 누가 썼는지. \`human:<id>\` 는 사람, \`<producer>/<version>\` 은 에이전트
- verified: { by, at } — 누가 출처와 대조해 확인했는지. 없으면 미검증
- sources: 근거가 된 자료. id 는 본문 각주 라벨의 조인 키
- kind: OKF 종류(Convention·Reference·Recipe…). type 은 형태(bookmarks·snippet·note)로 축이 다릅니다
- resource: 이 문서가 서술하는 자산

frontmatter 가 없거나 필드가 비어 있으면 "없음"이 아니라 "아직 기록되지 않음"입니다.
</SYSTEM>

# 문서 시작하기

${documents.join('\n')}`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
