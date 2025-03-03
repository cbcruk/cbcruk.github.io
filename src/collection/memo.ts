import { getCollection } from 'astro:content'

export const getReleaseMemoCollection = () =>
  getCollection('memo', ({ data }) =>
    import.meta.env.DEV ? true : data.status === 'release'
  )

export const getRandomMemoCollection = async () => {
  const memoCollection = await getReleaseMemoCollection()
  const memos = memoCollection.toSorted(() => Math.random() - 0.5).slice(0, 10)

  return memos
}
