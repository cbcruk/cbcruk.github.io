import { useEffect, useRef } from 'react'
import { SETTLE_DELAY, writeQuery } from './searchQuery'

export function SearchFormField({ query }: { query: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // 뒤로·앞으로로 주소가 바뀌면 입력창을 맞춘다. 타이핑이 정착해서 온 값은
  // 이미 입력창에 있는 것과 같아 아무 일도 하지 않는다
  useEffect(() => {
    const input = ref.current

    if (input && input.value !== query) {
      input.value = query
    }
  }, [query])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <input
      ref={ref}
      type="search"
      name="q"
      className="absolute top-0 left-0 w-full h-9 pl-8 pr-3 rounded-xl bg-transparent font-bold placeholder:font-normal"
      placeholder="본문내용 또는 태그를 검색해주세요."
      defaultValue={query}
      onChange={(event) => {
        // 상태를 두지 않아 이 핸들러는 렌더를 한 번도 일으키지 않는다.
        // 한글 조합 중에 React 가 값을 되쓰지 않는 것도 같은 이유다
        const { value } = event.target

        clearTimeout(timer.current)
        timer.current = setTimeout(() => writeQuery(value), SETTLE_DELAY)
      }}
    />
  )
}
