import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://cbcruk.github.io',
  integrations: [mdx(), sitemap(), tailwind(), react()],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
  redirects: {
    '/memos': '/memos/1',
    '/memo': '/memos/1',
  },
  output: import.meta.env.DEV ? 'server' : 'static',
})
