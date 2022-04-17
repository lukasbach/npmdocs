/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:packageName',
        destination: '/api/:packageName/docs-redirect',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
