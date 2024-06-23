/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate-plugin');
const path = require("path")
//const nextConfig = {
module.exports = nextTranslate({
  i18n: {
    locales: ['en' ],
    defaultLocale: 'en',
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles'),
    ],
  },
  reactStrictMode: false,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    HOST:process.env.HOST,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  serverRuntimeConfig: {
    DB: process.env.DB,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PWD: process.env.DB_PWD,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PWD: process.env.SUPER_ADMIN_PWD,
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
    CALLBACK_SECRET: process.env.CALLBACK_SECRET
  },
  publicRuntimeConfig: {
    HOST: `http://${process.env.HOSTNAME}:${process.env.PORT}`,
  },
  webpack: (config, { isServer, webpack }) => {
    return config;
  },
});

//module.exports = nextConfig
