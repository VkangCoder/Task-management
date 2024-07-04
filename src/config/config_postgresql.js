"use strict";
require("dotenv").config();
// config.js
const development = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    user: process.env.DEV_APP_DB_USER,
    host: process.env.DEV_APP_DB_HOST,
    port: process.env.DEV_APP_DB_PORT,
    database: process.env.DEV_APP_DB_NAME,
    password: process.env.DEV_APP_DB_PASSWORD,
  },

  // Các cấu hình khác cho development...
};

const production = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    user: process.env.PRO_APP_DB_USER,
    host: process.env.PRO_APP_DB_HOST,
    port: process.env.PRO_APP_DB_PORT,
    database: process.env.PRO_APP_DB_NAME,
    password: process.env.PRO_APP_DB_PASSWORD,
  },
  // Các cấu hình khác cho production...
};

const config = {
  development,
  production,
};

module.exports = config[process.env.NODE_ENV || "development"];
