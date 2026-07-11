/** @type {import('next').NextConfig} */
const nextConfig = {
  // This allows your other device to connect without security blocks
  allowedDevOrigins: ['192.168.1.228'],
  
  // This helps ensure the development server stays connected over LAN
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;