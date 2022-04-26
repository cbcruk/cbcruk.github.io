// @ts-check
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
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
  const contents = await getFile({ fileName: `/[tag]/${params.tag}` })
  const records = JSON.parse(contents)

  for (const record of records) {
    record.fields.serialize = await serialize(record.fields.body, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
      parseFrontmatter: true,
    })
  }

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
      fileName: `/[tag]/${tag.fields.select}`,
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
