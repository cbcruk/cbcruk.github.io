// @ts-check
import { useKBar } from 'kbar'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { DEFAULT_ACTIONS } from '../components/Kbar/constants'

export function useRegister(data) {
  const router = useRouter()
  const { query, currentActionsLength } = useKBar((state) => {
    return {
      currentActionsLength: Object.keys(state.actions).length,
    }
  })
  const actions = data.map(({ title, number }) => {
    return {
      id: `memo-${number}`,
      name: title,
      parent: 'memo',
      perform: () => router.push(`/memo/${number}`),
    }
  })

  useEffect(() => {
    if (currentActionsLength === DEFAULT_ACTIONS.length) {
      query.registerActions(actions)
    }
  }, [])
}
