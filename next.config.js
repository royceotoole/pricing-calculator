/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }]
    return config
  },
  // Ensure trailing slashes are handled properly
  trailingSlash: false,
  // Add image domains if needed for external images
  images: {
    domains: [], // Add any domains for external images here
  },
}

module.exports = nextConfig 