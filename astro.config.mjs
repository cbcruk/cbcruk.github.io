import { defineConfig, fontProviders } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { satteri } from '@astrojs/markdown-satteri'
import { satteriGithubAlert } from './src/plugins/satteri-github-alert.mjs'

// https://astro.build/config
export default defineConfig({
  adapter: process.env.VERCEL ? vercel() : undefined,
  site: 'https://cbcruk.github.io',
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: satteri({
      hastPlugins: [satteriGithubAlert()],
    }),
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
  redirects: {
    '/memos': '/memos/1',
    '/memo': '/memos/1',
  },
  output: process.env.VERCEL || import.meta.env.DEV ? 'server' : 'static',
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Noto Sans KR',
      cssVariable: '--font-noto-sans-kr',
      options: {
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
    },
  ],
})
