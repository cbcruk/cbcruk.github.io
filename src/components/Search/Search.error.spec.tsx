import { render, screen, userEvent, waitFor } from '@test/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Search } from './Search'

/**
 * 파일을 따로 두는 이유 — 코퍼스 promise 는 모듈 스코프에 memo 된다. 한 파일
 * 안에서 먼저 성공하면 그 promise 가 남아 실패를 재현할 수 없다. vitest 는
 * 파일마다 모듈을 새로 올린다.
 */
describe('Search — 코퍼스를 못 받을 때', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/search')
    window.dispatchEvent(new PopStateEvent('popstate'))
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.reject(new Error('Failed to fetch')),
        })
      )
    )
    // 에러 경계가 받은 것을 React 가 콘솔에도 찍는다
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('에러 경계가 받아 화면에 낸다', async () => {
    const user = userEvent.setup()

    render(<Search />)

    await user.type(screen.getByRole('searchbox'), '타입')

    await waitFor(
      () => expect(screen.getByText('Failed to fetch')).toBeInTheDocument(),
      { timeout: 2000 }
    )
  })
})
