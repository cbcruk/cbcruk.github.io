import { Button } from '@/components/Form/Button'
import { Textarea } from '@/components/Form/Textarea'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRef } from 'react'

function Revalidate() {
  const formRef = useRef<HTMLFormElement>(null)
  const mutation = useMutation({
    mutationFn: async () => {
      if (!formRef.current) {
        return
      }

      const formData = new FormData(formRef.current)

      return axios.post('/api/revalidate', {
        urlPath: formData.get('urlPath'),
      })
    },
    onSuccess: () => {
      if (!formRef.current) {
        return
      }

      formRef.current.reset()
    },
  })

  return (
    <div className="p-4 text-xs">
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
      >
        <Textarea name="urlPath" required />
        <Button type="submit">확인</Button>
      </form>
    </div>
  )
}

export default Revalidate
