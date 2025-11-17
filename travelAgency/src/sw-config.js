module.exports = {
    "globDirectory": "build/",
    "globPatterns": [
      "**/*.{html,js,css}"
    ],
    "swDest": "build/sw.js",
    "runtimeCaching": [
      {
        urlPattern: '/',
        handler: 'StaleWhileRevalidate'
      }
    ]
  };
  