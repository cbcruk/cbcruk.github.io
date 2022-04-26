// @ts-check
import { getAllMemo, getAllTags } from '$lib/airtable'
import { getFile, writeFile } from '$lib/file'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'

/**
 *
 * @param {object} props
 * @param {import('$lib/types').MemoRecord[]} props.data
 */
function Memos({ data }) {
  if (!data) {
    return null
  }

  return (
    <Layout title="Memo" isShowTitle={false}>
      <Preview type="memo" items={data} />
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps({ params }) {
  const contents = await getFile({ fileName: `/[tagged]/${params.tag}` })
  const records = JSON.parse(contents)

  return {
    props: {
      data: records,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const allMemo = await getAllMemo()
  const allTags = await getAllTags()

  writeFile({
    fileName: 'alltags',
    data: JSON.stringify(allTags),
  })

  for (const tag of allTags) {
    const data = allMemo
      .flatMap((r) => r)
      .filter((memo) => memo.fields.tags.includes(tag.fields.select))

    await writeFile({
      fileName: `/[tagged]/${tag.fields.select}`,
      data: JSON.stringify(data),
    })
  }

  return {
    fallback: true,
    paths: allTags.map((tag) => {
      return {
        params: { tag: `${tag.fields.select}` },
      }
    }),
  }
}

export default Memos
