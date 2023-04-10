/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/memo',
        permanent: false,
      },
    ]
  },
  experimental: {
    scrollRestoration: true,
    appDir: true,
  },
}
