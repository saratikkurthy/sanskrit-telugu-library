import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/pdf/:id',
        destination: '/api/file/:id',
      },
    ];
  },
};

module.exports = nextConfig;