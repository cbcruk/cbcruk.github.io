import rss from '@astrojs/rss'
import { getReleaseMemoCollection } from '@collection/memo'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts'

export async function GET(context) {
  const memoCollection = await getReleaseMemoCollection()

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: memoCollection.map((memo) => ({
      title: `#${memo.slug} 메모`,
      link: `/memo/${memo.slug}/`,
      pubDate: memo.data.ctime,
    })),
  })
}
