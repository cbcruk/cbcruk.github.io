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
      title: `#${memo.id} 메모`,
      link: `/memo/${memo.id}/`,
      pubDate: memo.data.ctime,
    })),
  })
}
