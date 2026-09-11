import { render, screen, userEvent, waitFor } from '@test/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Search } from './Search'

const CORPUS = [
  {
    i: '999',
    t: '타입 폭 불일치',
    k: ['mysql'],
    c: '2026-01-01',
    m: '2026-01-01',
    b: '읽는 쪽 타입이 컬럼 도메인보다 좁다',
  },
  {
    i: '998',
    t: '이벤트 루프 한 턴',
    k: ['javascript'],
    c: '2026-01-01',
    m: '2026-01-01',
    b: '마이크로태스크가 먼저다',
  },
]

/** history/browser 는 모듈 싱글톤이라 raw replaceState 를 모른다 — popstate 로 알린다 */
const goto = (search: string) => {
  window.history.replaceState(null, '', `/search${search}`)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const queryParam = () => new URL(window.location.href).searchParams.get('q')

describe('Search', () => {
  beforeEach(() => {
    goto('')
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ json: () => Promise.resolve(CORPUS) }))
    )
  })

  it('submit 없이 타이핑만으로 결과가 나온다', async () => {
    const user = userEvent.setup()

    render(<Search />)

    await user.type(screen.getByRole('searchbox'), '타입')

    await waitFor(() =>
      expect(screen.getByText('타입 폭 불일치')).toBeInTheDocument()
    )
    expect(screen.queryByText('이벤트 루프 한 턴')).not.toBeInTheDocument()
  })

  it('주소에 q 가 있으면 처음부터 결과가 나온다', async () => {
    goto('?q=루프')

    render(<Search />)

    await waitFor(() =>
      expect(screen.getByText('이벤트 루프 한 턴')).toBeInTheDocument()
    )
    expect(screen.getByRole('searchbox')).toHaveValue('루프')
  })

  it('입력이 멈추면 주소에 q 가 쓰인다', async () => {
    const user = userEvent.setup()

    render(<Search />)

    await user.type(screen.getByRole('searchbox'), '루프')

    expect(queryParam()).toBe(null)
    await waitFor(() => expect(queryParam()).toBe('루프'), { timeout: 2000 })
  })

  it('입력 중에는 결과가 그대로고, 멈춘 뒤 한 번 바뀐다', async () => {
    const user = userEvent.setup()

    render(<Search />)

    const input = screen.getByRole('searchbox')

    await user.type(input, '타입')
    await waitFor(() =>
      expect(screen.getByText('타입 폭 불일치')).toBeInTheDocument()
    )

    // 결과가 하나도 없는 질의로 이어서 친다
    await user.type(input, 'zzz')

    // 아직 멈추지 않았으므로 직전 결과가 그대로다
    expect(screen.queryByText(/검색결과값이 없습니다/)).not.toBeInTheDocument()
    expect(screen.getByText('타입 폭 불일치')).toBeInTheDocument()

    await waitFor(
      () =>
        expect(screen.getByText(/검색결과값이 없습니다/)).toBeInTheDocument(),
      { timeout: 2000 }
    )
  })
})
