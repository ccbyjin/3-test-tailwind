const express = require("express");
const router = express.Router();
const sql = require("mssql");

// 引入 sql 中間件
const connSql = require("../middleware/connSql.cjs");

// 處理 POST /users 的 API：新增用戶
router.post("/", connSql, async (req, res) => {
  // 接收前端放在 body data 裏傳來後端的資料
  const { id, name, phone, address, remark } = req.body;

  try {
    // 建立 mssql 請求物件
    const request = await req.pool.request();

    // 往請求物件身上添加參數
    request.input("id", sql.Char, id);
    request.input("name", sql.NVarChar, name);
    request.input("phone", sql.VarChar, phone);
    request.input("address", sql.NVarChar, address);
    request.input("remark", sql.NVarChar, remark);

    // 執行 INSERT 語句
    const result = await request.query(
      "INSERT INTO list VALUES (@id, @name, @phone, @address, @remark)",
    );
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error at Insert SQL Server", err);
    res.status(500).send("Error at Insert SQL Server");
  }
});

// 處理 GET /users 的 API：獲取用戶
router.get("/", connSql, async (req, res) => {
  try {
    const currentPage = req.query.page;

    // 建立 mssql 請求物件
    const request = await req.pool.request();

    let result = await request.query("SELECT * FROM list");

    result = result.recordset;
    let allUser = result;

    console.log("Result from database:", result); // 打印數據庫查詢結果
    console.log("All users:", allUser); // 打印所有用戶

    const pages = Math.ceil(result.length / 4);

    if (currentPage) {
      const index = (currentPage - 1) * 4;
      result = result.slice(index, index + 4);
    }

    res.status(200).json({ result, pages, allUser });
  } catch (err) {
    console.error("Error to Get all SQL Server", err);
    res.status(500).send("Error at Get all SQL Server");
  }
});

// FE -> BE
// config: { params: { key: value } } -> req.query
// url: /${value} -> req.params.key (route '/:key')
// POST data: { key: value } -> req.body.key

// 處理 GET /users/:val 的 API：獲取特定用戶
router.get("/:val", connSql, async (req, res) => {
  const searchVal = req.params.val;
  const currentPage = req.query.page;

  try {
    const request = await req.pool.request();

    request.input("val", sql.Char, "%" + searchVal + "%");

    let result = await request.query(
      "SELECT * FROM list WHERE id LIKE @val OR name LIKE @val OR phone LIKE @val OR address LIKE @val OR remark LIKE @val",
    );
    result = result.recordset;

    const pages = Math.ceil(result.length / 4);

    if (currentPage) {
      const index = (currentPage - 1) * 4;
      result = result.slice(index, index + 4);
    }

    res.status(200).json({ result, pages });
  } catch (err) {
    console.error("Error at Get by ID SQL Server", err);
    res.status(500).send("Error at Get by ID SQL Server");
  }
});

// 處理 PUT /users/:id 的 API：更新特定用戶
router.put("/:id", connSql, async (req, res) => {
  const userId = req.params.id;
  const { name, phone, address, remark } = req.body;

  try {
    const request = await req.pool.request();

    request.input("id", sql.Char, userId);
    request.input("name", sql.NVarChar, name);
    request.input("phone", sql.VarChar, phone);
    request.input("address", sql.NVarChar, address);
    request.input("remark", sql.NVarChar, remark);

    const result = await request.query(
      "UPDATE list SET name = @name, phone = @phone, address = @address, remark = @remark WHERE id = @id",
    );
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error at Update SQL Server", err);
    res.status(500).send("Error at Update SQL Server");
  }
});

// 處理 DELETE /users/:id 的 API：刪除特定用戶
router.delete("/:id", connSql, async (req, res) => {
  const userId = req.params.id;
  try {
    const request = await req.pool.request();

    request.input("id", sql.Char, userId);

    const result = await request.query("DELETE FROM list WHERE id = @id");
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error at Delete SQL Server", err);
    res.status(500).send("Error at Delete SQL Server");
  }
});

module.exports = router;
