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
          >
            Home
          </a>
          <a
            class="data-[is-active='true']:font-bold"
            data-is-active="false"
            href="/about"
          >
            About
          </a>
          <a
            class="data-[is-active='true']:font-bold"
            data-is-active="false"
            href="/memos/1"
          >
            Memo
          </a>
          <a
            class="data-[is-active='true']:font-bold"
            data-is-active="false"
            href="/tagged"
          >
            Tag
          </a>
        </nav>
      </div>
    `)
  })
})
