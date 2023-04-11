import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'

export async function serializeHandler({ source, id }) {
  return serialize(source, {
    mdxOptions: {
      remarkPlugins: [
        [remarkGfm],
        [
          remarkRehype,
          {
            clobberPrefix: id,
          },
        ],
      ],
      rehypePlugins: [rehypeHighlight],
    },
    parseFrontmatter: true,
  })
}

export async function mdxSerialize(records) {
  for (const record of records) {
    record.fields.serialize = await serializeHandler({
      source: record.fields.body,
      id: record.id,
    })
  }
}
