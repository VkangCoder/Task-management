"use strict";
const Database = require("./dbs/init.postgresql.lv0");
const db = new Database();
const { Client } = require("pg");
const client = db.getClient();

const _SECONDS = 5000;
//check overload
const overload = () => {
  setInterval(async () => {
    try {
      const res = await client.query("SELECT COUNT(*) FROM pg_stat_activity");
      console.log("Number of active connections:", res.rows[0].count);
    } catch (error) {
      console.error("Error querying active connections:", error);
    }
  }, _SECONDS); //Monitor every 5 seconds
};

//start checking
overload();

//
process.on("exit", () => {
  client.end();
});
