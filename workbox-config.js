module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,gif,woff,woff2,ttf,otf}'
  ],
  swSrc: 'src/custom-service-worker.js', // your SW
  swDest: 'build/service-worker.js',
};
