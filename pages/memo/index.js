// @ts-check
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import { getMemo } from '$lib/airtable'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { useRegister } from '../../hooks/useRegister'
import { Pagination } from 'components/Pagination'

/**
 *
 * @param {object} props
 * @param {import('$lib/types').MemoRecord[]} props.data
 */
function Memos({ data }) {
  useRegister(data)

  return (
    <Layout title="Memo" isShowTitle={false}>
      <Preview type="memo" items={data} />
      <Pagination pagination={[null, 2, null]} />
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const { records } = await getMemo()

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

export default Memos
