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
}
