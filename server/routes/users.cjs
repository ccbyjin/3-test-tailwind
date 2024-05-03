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
      "INSERT INTO list VALUES (@id, @name, @phone, @address, @remark)"
    );
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error at Insert SQL Server", err);
    res.status(500).send('Error at Insert SQL Server');
  }
});

// 處理 GET /users 的 API：獲取用戶
router.get("/", connSql, async (req, res) => {
  try {
    // 建立 mssql 請求物件
    const request = await req.pool.request();
    const result = await request.query("SELECT * FROM list");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error to Get all SQL Server", err);
    res.status(500).send('Error at Get all SQL Server');
  }
});

// 處理 GET /users/:id 的 API：獲取特定用戶
ashdhsadas

router.get("/:id", connSql, async (req, res) => {
  const userId = req.params.id;
  try{

 // dao.select(id)

    const request = await req.pool.request();
    
    request.input("id", sql.Char, userId);

    const result = await request.query("SELECT * FROM list WHERE id = @id");
    
    res.status(200).json(result.recordset);
    
    console.log(result.recordset);

  } catch (err) {
    console.error("Error at Get by ID SQL Server", err);
    res.status(500).send('Error at Get by ID SQL Server');
  }
})

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
      "UPDATE list SET name = @name, phone = @phone, address = @address, remark = @remark WHERE id = @id"
    );
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error at Update SQL Server", err);
    res.status(500).send('Error at Update SQL Server');
  }
});

// 處理 DELETE /users/:id 的 API：刪除特定用戶
router.delete("/:id", connSql, async (req, res) => {
  const userId = req.params.id;
  try {
    const request = await req.pool.request();

    request.input('id', sql.Char, userId);

    const result = await request.query("DELETE FROM list WHERE id = @id");
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error at Delete SQL Server", err);
    res.status(500).send('Error at Delete SQL Server');
  }
});

module.exports = router;
