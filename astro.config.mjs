import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

console.log(process.env)

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
  experimental: {
    fonts: [
      {
        provider: 'local',
        name: 'Noto Sans KR',
        cssVariable: '--font-noto-sans-kr',
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: [
              './src/assets/fonts/noto-sans-kr-v27-korean_latin-regular.woff2',
            ],
          },
          {
            weight: 700,
            style: 'normal',
            src: ['./src/assets/fonts/noto-sans-kr-v27-korean_latin-700.woff2'],
          },
        ],
      },
    ],
  },
})
