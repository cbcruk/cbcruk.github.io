import { render } from '@test/utils'
import { Nav } from './Nav'
import { describe, expect, it } from 'vitest'

describe('Nav', () => {
  it('render', () => {
    const { container } = render(<Nav pathname="/a" />)

    expect(container).toMatchInlineSnapshot(`
      <div>
        <nav
          class="flex items-center gap-2 text-sm"
        >
          <a
            class="data-[is-active='true']:font-bold"
            data-is-active="false"
            href="/"
            title="홈"
          >
            <img
              alt="홈"
              height="16"
              src="/favicon-32x32.png"
              width="16"
            />
          </a>
          <a
            class="data-[is-active='true']:font-bold"
            data-is-active="false"
            href="/memos/1"
          >
            메모
          </a>
          <a
            class="data-[is-active='true']:font-bold"
            data-is-active="false"
            href="/search"
          >
            검색
          </a>
        </nav>
      </div>
    `)
  })
})
