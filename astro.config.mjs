import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import partytown from '@astrojs/partytown'

// https://astro.build/config
export default defineConfig({
  site: 'https://cbcruk.github.io/',
  integrations: [mdx(), sitemap(), tailwind(), react(), partytown()],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
  redirects: {
    '/memos': '/memos/1',
    '/memo': '/memos/1',
  },
})
