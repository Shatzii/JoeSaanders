/** @type {import('next').NextConfig} */
const path = require('path')
// Only enable static export when explicitly requested. Do NOT force it on Netlify,
// because API routes (e.g., /api/auth/[auth0]) require SSR and are unsupported in export mode.
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  // Deployment mode
  ...(isStaticExport
    ? { output: 'export', trailingSlash: true, distDir: 'out' }
    : {}),

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Temporarily disable ESLint during build for testing
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'supabase.co' },
      { protocol: 'https', hostname: 'githubusercontent.com' },
      { protocol: 'https', hostname: 'fonts.gstatic.com' },
      { protocol: 'https', hostname: 'fonts.googleapis.com' },
      { protocol: 'https', hostname: 'elevenlabs.io' },
      { protocol: 'https', hostname: 'openai.com' },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Exclude mobile directory from build (handled by tsconfig for TS)
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        'react-vendor': {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 20,
        },
        'three-vendor': {
          test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
          name: 'three-vendor',
          chunks: 'all',
          priority: 15,
        },
      }
    }

    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze/client.html',
          openAnalyzer: false,
        })
      )
    }

    return config
  },

  // Silence monorepo root warning by explicitly setting the output file tracing root
  // Our app lives in a subfolder (joe-sanders-golf) of the workspace repository
  outputFileTracingRoot: path.join(__dirname, '..'),

  // Headers aren't supported automatically in export mode
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/api/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value:
                    'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
                },
              ],
            },
            {
              source: '/_next/static/:path*',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
            {
              source: '/images/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value:
                    'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
                },
              ],
            },
          ]
        },
      }),
}

module.exports = nextConfig
