const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://api.aviationstack.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/v1',  // rewrite path
      },
    })
  );
};
