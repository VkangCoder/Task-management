const mysql = require("mysql2");

// Cấu hình cho MySQL master
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  port: 8811,
  user: "root",
  password: "tipjs",
  database: "test",
});

// Cấu hình cho MySQL slave
// const poolSlave = mysql.createPool({
//   connectionLimit: 10,
//   host: "localhost",
//   port: 8822,
//   user: "root",
//   password: "tipjs",
//   database: "test",
// });

const batchSize = 100000;
const totalSize = 1000000;

let currentId = 1;
console.time("::::::TIMMER::::::::::::;;");
const insertBatch = async () => {
  const value = [];
  for (let index = 0; index < batchSize && currentId <= totalSize; index++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    value.push([currentId, name, age, address]);
    currentId++;
  }
  if (!value.length) {
    pool.end((err) => {
      if (err) console.log(`Error occured while running batch`);
      else {
        console.log(`connection pool closed succesfully`);
        console.timeEnd("::::::TIMMER::::::::::::;;"); // Stop timer and print time
      }
    });
    return;
  }
  const sql = `INSERT INTO test_table (id,name,age,address) values?`;
  pool.query(sql, [value], async function (err, results) {
    if (err) throw err;
    console.log(`Insert ${results.affectedRows} records`);
    await insertBatch();
  });
};
insertBatch().catch(console.err);
// // Test kết nối đến MySQL master
// testConnection(poolMaster, "MYSQL8-MASTER");

// // Test kết nối đến MySQL slave
// testConnection(poolSlave, "MYSQL8-SLAVE");
