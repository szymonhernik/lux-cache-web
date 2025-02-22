const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
/** @type {import('next').NextConfig} */
const coreConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/ikrxgij3/production/**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.io',
        pathname: 'dmowkzh44/video/upload/**'
      },
      {
        protocol: 'https',
        hostname: 'cloud-lc.b-cdn.net',
        pathname: '/video/upload/**'
      },
      {
        protocol: 'https',
        hostname: 'pub-e18f0b6cf12246908bb3d80c99e28ea9.r2.dev',
        pathname: '/output/**'
      }
    ]
  },
  experimental: {
    taint: true
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}
const { withSentryConfig } = require('@sentry/nextjs')
const config = withSentryConfig(coreConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'szy-her',
  project: 'lc-web',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
})
module.exports = withBundleAnalyzer(config)
