import history from 'history/browser'
import { useSearchParamsQuery } from './hooks/useSearchParamsQuery'
import { useFormStatus } from 'react-dom'

function Input() {
  const q = useSearchParamsQuery()
  const status = useFormStatus()

  return (
    <input
      type="search"
      name="q"
      className="absolute top-0 left-0 w-full h-9 pl-8 pr-3 rounded-xl bg-transparent font-bold placeholder:font-normal"
      placeholder="본문내용 또는 태그를 검색해주세요."
      defaultValue={q}
      disabled={status.pending}
    />
  )
}

export function SearchFormField() {
  return (
    <form
      action={(formData) => {
        const q = (formData.get('q') || '') as string

        const url = new URL(window.location.href)

        url.searchParams.set('q', q)

        history.replace(url.toString())
      }}
    >
      <Input />
    </form>
  )
}
