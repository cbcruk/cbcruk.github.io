// @ts-check
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from 'components/Form/Button'
import { Textarea } from 'components/Form/Textarea'
import { toastError } from 'components/Toaster/handler'
import { useRef } from 'react'
import { match } from 'ts-pattern'

function Links() {
  const formRef = useRef(null)
  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData(formRef.current)
      const data = formData.get('input')

      return axios
        .post('/api/md', {
          data,
        })
        .then((r) => r.data)
    },
    onSuccess: async (data) => {
      await navigator.clipboard.writeText(data)

      formRef.current.reset()
    },
  })

  return (
    <div className="max-w-[400px] p-4 text-xs">
      <div className="p-2">
        {match(mutation)
          .with({ isIdle: true }, () => <p>...</p>)
          .with({ isLoading: true }, () => (
            <p>로드 중... 요청을 처리하는 동안 잠시 기다려 주십시오.</p>
          ))
          .with({ isError: true }, () => <p>에러가 발생했습니다.</p>)
          .with({ isSuccess: true }, ({ data }) => (
            <p title={data}>응답 결과값이 클립보드에 저장되었습니다.</p>
          ))
          .otherwise(() => null)}
      </div>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault()

          const hasInvalid = e.currentTarget.input.value
            .split('\n')
            .some((value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))

          if (hasInvalid) {
            toastError('이메일 형식을 입력해주세요')
            return
          }

          mutation.mutate()
        }}
        className="mt-2"
      >
        <Textarea name="input" required />
        <div className="flex justify-end">
          <Button type="submit">전송</Button>
        </div>
      </form>
    </div>
  )
}

export default Links
