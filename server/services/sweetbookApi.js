const { SweetbookClient } = require('bookprintapi-nodejs-sdk');

const client = new SweetbookClient({
  apiKey: process.env.SWEETBOOK_API_KEY,
  environment: process.env.SWEETBOOK_ENV || 'sandbox',
});

module.exports = client;
