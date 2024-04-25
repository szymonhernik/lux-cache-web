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
    remotePatterns: [{ hostname: 'placeholder.pics' }]
  }
};
module.exports = nextConfig;
