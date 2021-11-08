import { useCallback, useState } from 'react'
import Layout from '../components/Layout'

function Links() {
  const [result, setResult] = useState('')
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    const value = e.target.input.value

    if (!value) {
      return
    }

    const response = await fetch('/api/md', {
      method: 'POST',
      body: e.target.input.value,
    })
    const { data } = await response.json()

    setResult(data)
  }, [])

  return (
    <Layout title="링크">
      <form onSubmit={handleSubmit} className="text-sm mt-4">
        <textarea
          name="input"
          className="block w-full h-40 bg-gray-400 rounded-md p-2 text-black"
        />
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 p-1 rounded-md mt-2">
            전송
          </button>
        </div>
      </form>

      <hr className="mt-4 mb-4" />

      <pre
        className="overflow-hidden p-2 bg-green-600 rounded-md text-xs text-black cursor-pointer"
        onClick={async () => {
          await navigator.clipboard.writeText(result)
        }}
      >
        {result}
      </pre>
    </Layout>
  )
}

export default Links
