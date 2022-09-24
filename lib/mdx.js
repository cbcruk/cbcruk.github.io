import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'

export async function mdxSerialize(records) {
  for (const record of records) {
    record.fields.serialize = await serialize(record.fields.body, {
      mdxOptions: {
        remarkPlugins: [
          [remarkGfm],
          [
            remarkRehype,
            {
              clobberPrefix: record.id,
            },
          ],
        ],
        rehypePlugins: [rehypeHighlight],
      },
      parseFrontmatter: true,
    })
  }
}
