const sql = require("mssql");

// sql server 設定
const config = {
  user: "sqlap",
  password: "Ubot@1234",
  server: "172.16.45.213",
  database: "list",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// sa - docker sql server 設定
// const config = {
//   user: "sa", //sqlap
//   password: "strongp@ssword",
//   server: "localhost",
//   database: "list",
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };

// sa - sql server 設定
// const config = {
//   user: "sa", //sqlap
//   password: "strongp@ssword",
//   server: "192.168.1.114",
//   database: "list",
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };

// nana - sql server 設定
// const config = {
//   user: "sa",
//   password: "StrongP@ssw0rd",
//   server: "localhost",
//   database: "list",
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// }

// 建立連接
let pool;

module.exports = async (req, res, next) => {
  try {
    // 確定已經建立連接
    if (!pool) pool = await sql.connect(config);
    console.log("Connected to SQL Server");

    // 把 sql 連接器往請求體身上放，方便下個函式調用
    req.pool = pool;
    next();
  } catch (err) {
    console.error("Error connecting to SQL Server", err);
    return res.status(500).send("Error connecting to SQL Server", err);
  }
};
