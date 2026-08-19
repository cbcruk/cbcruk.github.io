/**
 * 죽은 링크 찾기 — 메모의 진짜 부식은 링크다.
 *
 * 코퍼스의 절반이 `bookmarks`이고 본문이 링크뿐이라, 죽은 링크는 곧
 * 메모 전체가 무효라는 뜻이다. `mtime`은 신선도가 아니다 — 542개 중
 * 288개가 일괄 수정 자국(2024-03-22)이고 `ctime`도 182개가 마이그레이션
 * 시점(2022-04-09)이다. 그래서 신선도는 선언하지 않고 링크로 판정한다.
 *
 * 빌드에 연결하지 않는다 — 네트워크에 의존하고 느리고, 남의 서버 상태로
 * 내 빌드가 깨지면 안 된다. 가끔 돌리는 도구.
 *
 *   node scripts/lint-links.mjs             전체
 *   node scripts/lint-links.mjs --release   공개 메모만
 *   node scripts/lint-links.mjs 229         특정 메모만
 *   node scripts/lint-links.mjs --strict    죽은 링크가 있으면 exit 1
 *
 * 403·405·429·타임아웃은 "죽음"으로 세지 않는다 — 봇 차단이 흔하다.
 * 죽었다고 단정하는 건 404·410·DNS 실패뿐이다.
 */
import fs from 'node:fs/promises'
import fg from 'fast-glob'

const CONCURRENCY = 8
const TIMEOUT_MS = 10000

const args = process.argv.slice(2)
const releaseOnly = args.includes('--release')
const strict = args.includes('--strict')
const onlyId = args.find((arg) => /^\d+$/.test(arg))

const collectUrls = (raw) => {
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
  let insideFence = false
  const lines = []

  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) {
      insideFence = !insideFence
      continue
    }
    // 코드 안의 URL은 예시일 수 있다 (실제로 열어보는 링크가 아니다)
    if (!insideFence) lines.push(line)
  }

  return new Set(
    [...lines.join('\n').matchAll(/https?:\/\/[^\s)\]<>"'`]+/g)].map(([url]) =>
      url.replace(/[.,]+$/, '')
    )
  )
}

const check = async (url) => {
  const attempt = async (method) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
      const response = await fetch(url, {
        method,
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          // 봇 차단을 조금이라도 줄인다
          'user-agent':
            'Mozilla/5.0 (compatible; memo-link-check/1.0; +https://cbcruk.github.io)',
        },
      })

      return { status: response.status }
    } finally {
      clearTimeout(timer)
    }
  }

  try {
    // HEAD 를 막는 서버가 많아서 실패하면 GET 으로 한 번 더
    let { status } = await attempt('HEAD')

    if (status === 405 || status === 501 || status === 403) {
      status = (await attempt('GET')).status
    }

    if (status === 404 || status === 410) {
      return { verdict: 'dead', detail: String(status) }
    }
    if (status >= 200 && status < 400) {
      return { verdict: 'alive', detail: String(status) }
    }

    return { verdict: 'unknown', detail: String(status) }
  } catch (error) {
    const code = error?.cause?.code ?? error?.code ?? error?.name ?? 'error'

    // 도메인이 사라진 것은 죽음으로 본다
    if (code === 'ENOTFOUND') {
      return { verdict: 'dead', detail: 'ENOTFOUND' }
    }

    return { verdict: 'unknown', detail: String(code), network: true }
  }
}

const mapWithLimit = async (items, limit, worker) => {
  const results = []
  let cursor = 0
  let done = 0

  const run = async () => {
    while (cursor < items.length) {
      const index = cursor++

      results[index] = await worker(items[index])
      done++

      if (done % 25 === 0) {
        process.stderr.write(`\r  ${done}/${items.length} 확인`)
      }
    }
  }

  await Promise.all(Array.from({ length: limit }, run))

  if (items.length >= 25) process.stderr.write('\r'.padEnd(30) + '\r')

  return results
}

const main = async () => {
  const dir = process.env.MEMO_DIR ?? './src/content/memo'
  const entries = await fg.glob(`${dir}/*.{md,mdx}`)
  const memos = []

  for (const path of entries) {
    const raw = await fs.readFile(path, 'utf-8')
    const id = path.match(/\/(\d+)\.(md|mdx)$/)[1]
    const status =
      (raw.match(/^status:\s*(\w+)/m) ?? [])[1] ?? 'draft'

    if (onlyId && id !== onlyId) continue
    if (releaseOnly && status !== 'release') continue

    memos.push({ id, status, urls: collectUrls(raw) })
  }

  // URL 하나를 여러 메모가 가리킬 수 있으니 한 번만 확인한다
  const owners = new Map()

  for (const memo of memos) {
    for (const url of memo.urls) {
      owners.set(url, [...(owners.get(url) ?? []), memo])
    }
  }

  const urls = [...owners.keys()]

  if (urls.length === 0) {
    console.log('확인할 링크가 없다')
    return
  }

  console.log(`메모 ${memos.length}개 / 링크 ${urls.length}개 확인 중...`)

  const results = await mapWithLimit(urls, CONCURRENCY, async (url) => ({
    url,
    ...(await check(url)),
  }))

  const networkFailures = results.filter(({ network }) => network).length

  // 프록시·오프라인이면 전부 실패한다 — 그걸 "죽은 링크"라고 보고하면 거짓이다
  if (networkFailures > urls.length / 2) {
    console.error(
      `\n네트워크로 나갈 수 없다 (${networkFailures}/${urls.length} 연결 실패).\n` +
        '링크 상태를 판정하지 않고 종료한다. 직접 네트워크가 되는 곳에서 실행할 것.'
    )
    process.exit(2)
  }

  const dead = results.filter(({ verdict }) => verdict === 'dead')
  const unknown = results.filter(({ verdict }) => verdict === 'unknown')

  const label = (url) =>
    owners
      .get(url)
      .map(({ id, status }) => `#${id}${status === 'release' ? '' : `(${status})`}`)
      .join(' ')

  for (const { url, detail } of dead) {
    console.log(`✗ ${detail}  ${url}\n      ${label(url)}`)
  }
  for (const { url, detail } of unknown) {
    console.log(`? ${detail}  ${url}\n      ${label(url)}`)
  }

  console.log(
    `\n죽은 링크 ${dead.length}개, 확인 불가 ${unknown.length}개 ` +
      `(살아 있음 ${results.length - dead.length - unknown.length}개)`
  )

  if (unknown.length > urls.length / 2) {
    // 프록시가 CONNECT 를 막으면 연결 오류가 아니라 403 이 온다 (이 저장소의
    // 원격 실행 환경이 그렇다) — 그때도 죽었다고 단정하지 않는다
    console.log(
      '확인 불가가 절반을 넘는다. 네트워크 경로가 걸러지고 있을 수 있으니\n' +
        '판정을 신뢰하지 말고 직접 네트워크가 되는 곳에서 다시 실행할 것.'
    )
  } else if (unknown.length > 0) {
    console.log(
      '확인 불가는 봇 차단·타임아웃일 수 있다. 브라우저로 직접 확인할 것.'
    )
  }

  if (strict && dead.length > 0) {
    process.exit(1)
  }
}

main()
