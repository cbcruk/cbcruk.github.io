import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'

type SerializeHandlerParams = {
  source: Parameters<typeof serialize>[0]
  id: string
}

export async function serializeHandler({ source, id }: SerializeHandlerParams) {
  return serialize(source, {
    mdxOptions: {
      remarkPlugins: [
        [remarkGfm],
        [
          // @ts-ignore
          remarkRehype,
          {
            clobberPrefix: id,
          },
        ],
      ],
    },
    parseFrontmatter: true,
  })
}

export async function mdxSerialize(records: any[]) {
  for (const record of records) {
    record.fields.serialize = await serializeHandler({
      source: record.fields.body,
      id: record.id,
    })
  }
}
