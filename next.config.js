/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Production-ready configuration with proper error checking
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['pdfmake'],
  },
  // Disable image optimization for PDF files which can be large
  images: {
    unoptimized: true
  },
  // Disable font optimization to prevent Google Fonts timeouts
  optimizeFonts: false,
  // Set specific settings to help with build errors
  reactStrictMode: true,
  swcMinify: true,
  distDir: '.next',
  // Transpile ESM packages
  transpilePackages: ['@react-pdf/renderer', 'react-pdf', '@babel/runtime'],
  // Ensure proper error handling
  onDemandEntries: {
    // Keep the pages in memory for longer
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    // The number of pages to keep in memory
    pagesBufferLength: 5,
  },
  // Explicitly set which paths to exclude from static page generation
  excludeDefaultMomentLocales: true,
  webpack: (config) => {
    // This is necessary for pdfmake to work correctly
    config.resolve.alias = {
      ...config.resolve.alias,
      fs: false,
      path: false,
    };
    return config;
  }
};

module.exports = nextConfig; 