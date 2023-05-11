/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverDependenciesToBundle: [
    '@sindresorhus/slugify',
    '@sindresorhus/transliterate',
    'escape-string-regexp',
  ],
  cacheDirectory: './node_modules/.cache/remix',
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  ignoredRouteFiles: ['**/.*', '**/*.test.{js,jsx,ts,tsx}'],
  postcss: true,
  tailwind: true,
};
