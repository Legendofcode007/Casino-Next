module.exports = {
  locales: ['en','ko'], // Array with the languages that you want to use
  defaultLocale: 'ko', // Default language of your website
  localeDetection: false,
  pages: {
    '*': ['common'], // Namespaces that you want to import per page (we stick to one namespace for all the application in this tutorial)
  },
};