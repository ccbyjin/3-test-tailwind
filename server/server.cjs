const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");

app.use(cors()); // 允許所有來源的跨域請求

// 引入 sql 中間件
const connSql = require("./middleware/connSql.cjs");

// 引入使用者路由
const usersRouter = require("./routes/users.cjs");

// debug 用於解析JSON請求體，限制大小為2000kb
app.use(express.json({ limit: "2000kb" }));
// debug 用於解析URL編碼的請求體
app.use(express.urlencoded({ extended: false }));

// 處理 / 根目錄的 GET 請求
// 為了方便測試而寫的
app.get("/", connSql, async (req, res) => {
  try {
    const result = await req.pool.query("SELECT * FROM list");
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error at Query SQL Server", err);
    res.status(500).send("Error at Query SQL Server");
  }
});

// 處理以 /users 為開頭的路由請求
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
