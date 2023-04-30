import localFont from 'next/font/local'

export const noto = localFont({
  src: [
    {
      path: './noto-sans-kr-v27-korean_latin-700.woff2',
      weight: '700',
    },
    {
      path: './noto-sans-kr-v27-korean_latin-regular.woff2',
      weight: '400',
    },
  ],
})
