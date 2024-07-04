"use strict";
const { Pool } = require("pg");
const fs = require("fs");
const config = require("../config/config_postgresql");
const caCert = fs.readFileSync(require.resolve("./ca.pem")).toString();
class Database {
  constructor() {
    //config
    this.pool = new Pool({
      user: config.db.user,
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      password: config.db.password,
      ssl: {
        rejectUnauthorized: true,
        ca: caCert, // Thêm chứng chỉ CA
      },
      max: 3,
      idleTimeoutMillis: 30000, // Thời gian chờ trước khi một kết nối không hoạt động được đóng
      connectionTimeoutMillis: 2000, // Thời gian chờ kết nối tối đa
    });
    this.testConnection();
  }
  //testconnect
  async testConnection() {
    try {
      await this.pool.query("SELECT 1");
      console.log("Kết nối tới cơ sở dữ liệu thành công.");
    } catch (err) {
      console.error("Kết nối tới cơ sở dữ liệu thất bại:", err);
    }
  }

  //định nghĩa query
  async query(text, params) {
    const res = await this.pool.query(text, params);
    return res;
  }

  //CloseConnect
  async disconnect() {
    await this.pool.end();
    console.log("Đã ngắt kết nối khỏi cơ sở dữ liệu");
  }
}

module.exports = Database;
