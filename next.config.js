// module.exports = {
//   logging: {
//     fetches: {
//       fullUrl: true
//     }
//   }
// };
// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { hostname: 'placeholder.pics' },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io'
      }
    ]
  },
  experimental: {
    taint: true
  }
  // logging: {
  //   fetches: {
  //     fullUrl: true
  //   }
  // }
}
module.exports = nextConfig
