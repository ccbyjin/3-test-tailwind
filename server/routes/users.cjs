const express = require("express"); // 用於創建路由
const router = express.Router(); // 創建一個路由實例
const sql = require("mssql"); // 用於連接數據庫

// 引入 sql 中間件 -> 用於連接SQL Server 數據庫
const connSql = require("../middleware/connSql.cjs");

// 處理 POST /users 的 API：新增用戶
router.post("/", connSql, async (req, res) => {
  // 接收前端放在 body data 裏傳來後端的資料
  // 使用解構形式
  const { id, name, phone, address, remark } = req.body;

  try {
    // 建立 mssql 請求物件
    // req.pool -> SQL 連接池 通過connSql請求物件
    const request = await req.pool.request();

    // 往請求物件身上添加參數
    request.input("id", sql.Char, id);
    request.input("name", sql.NVarChar, name);
    request.input("phone", sql.VarChar, phone);
    request.input("address", sql.NVarChar, address);
    request.input("remark", sql.NVarChar, remark);

    // 執行INSERT語句，將數據插入到list表中
    const result = await request.query(
      "INSERT INTO list VALUES (@id, @name, @phone, @address, @remark)",
    );
    // 將從數據庫查詢中獲取的結果轉換成JSON格式
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error at Insert SQL Server", err);
    res.status(500).send("Error at Insert SQL Server");
  }
});

// 處理 GET /users 的 API：獲取用戶
router.get("/", connSql, async (req, res) => {
  try {
    // 獲取查詢參數中的當前頁碼
    const currentPage = req.query.page;

    // 建立 mssql 請求物件
    const request = await req.pool.request();

    // 執行SQL查詢，獲取所有用戶數據
    let result = await request.query("SELECT * FROM list");

    // 取出查詢結果中的recordset
    result = result.recordset;
    let allUser = result;

    console.log("Result from database:", result); // 打印數據庫查詢結果
    console.log("All users:", allUser); // 打印所有用戶

    // 計算總頁數，每頁顯示4筆數據
    const pages = Math.ceil(result.length / 4);

    // 如果當前請求中包含頁碼
    // -> 計算當前起始的索引值
    // -> 擷取當前頁面需顯示的數據
    if (currentPage) {
      const index = (currentPage - 1) * 4;
      result = result.slice(index, index + 4);
    }

    // 返回狀態，並以json格式返回數據{當頁數據, 總頁數, 所有user}
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
  const searchVal = req.params.val; // 從url參數中獲取搜索值
  const currentPage = req.query.page; // 從查詢參數中獲取當前頁碼

  try {
    // 創建mssql請求物件
    const request = await req.pool.request();

    // 設置查詢參數 使用模糊查詢
    request.input("val", sql.Char, "%" + searchVal + "%");

    // 查詢匹配數據
    let result = await request.query(
      "SELECT * FROM list WHERE id LIKE @val OR name LIKE @val OR phone LIKE @val OR address LIKE @val OR remark LIKE @val",
    );
    result = result.recordset; // 獲取查詢結果

    // 計算總頁數，每頁4筆數據
    const pages = Math.ceil(result.length / 4);

    if (currentPage) {
      const index = (currentPage - 1) * 4; // 計算當前的起始索引
      result = result.slice(index, index + 4); // 獲取當前頁的數據
    }

    res.status(200).json({ result, pages });
  } catch (err) {
    console.error("Error at Get by ID SQL Server", err);
    res.status(500).send("Error at Get by ID SQL Server");
  }
});

// 處理 PUT /users/:id 的 API：更新特定用戶
router.put("/:id", connSql, async (req, res) => {
  const userId = req.params.id; // 從url獲取用戶id
  const { name, phone, address, remark } = req.body; // 從請求體中獲取用戶數據

  try {
    // 創建請求物件
    const request = await req.pool.request();

    // 設置更參數
    request.input("id", sql.Char, userId);
    request.input("name", sql.NVarChar, name);
    request.input("phone", sql.VarChar, phone);
    request.input("address", sql.NVarChar, address);
    request.input("remark", sql.NVarChar, remark);

    // 執行更新語句 -> 更新list中的數據
    const result = await request.query(
      "UPDATE list SET name = @name, phone = @phone, address = @address, remark = @remark WHERE id = @id",
    );
    // 返回狀態碼 + 更新結果
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
