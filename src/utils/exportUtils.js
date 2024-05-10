// 引入Excel套件
import ExcelJs from "exceljs";
// 引入PDF套件
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../public/NotoSansTC-VariableFont_wght-normal.js";

const exportToExcel = async (userData) => {
  const allUserData = userData.map((user) => ({
    id: user.id,
    name: user.name,
    phone: user.phone,
    address: user.address,
    remark: user.remark,
  }));

  // 創建一個新的工作簿
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // 添加數據到工作表
  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Name", key: "name", width: 20 },
    { header: "Phone", key: "phone", width: 20 },
    { header: "Address", key: "address", width: 50 },
    { header: "Remark", key: "remark", width: 50 },
  ];

  // 添加數據行
  allUserData.forEach((row) => {
    worksheet.addRow(row);
  });

  // 生成 Excel 檔案
  const buffer = await workbook.xlsx.writeBuffer();

  // 下載 Excel 檔案
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const fileName = "User.xlsx";
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

const exportToPdf = async (userData) => {
  // 創建 PDF
  const doc = new jsPDF();

  // 定義表頭和數據
  const headers = [["id", "name", "phone", "address", "remark"]];
  const body = userData.map((item) => [
    item.id,
    item.name,
    item.phone,
    item.address,
    item.remark,
  ]);

  doc.setFont("NotoSansTC-VariableFont_wght", "normal"); // 跟字形檔addFont那邊一致的名稱

  let pageNumber;

  // 自動生成表格
  autoTable(doc, {
    head: headers,
    body,
    styles: {
      font: "NotoSansTC-VariableFont_wght",
    },
    didParseCell: (hookData) => {
      if (
        hookData.row.index === body.length - 1 &&
        hookData.cell.name === "body"
      ) {
        pageNumber = hookData.table.pageNumber;
      }
    },
  });

  // 在生成的 PDF 中添加頁碼
  for (let i = 1; i <= pageNumber; i++) {
    doc.setPage(i);
    let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber; //現在這頁
    doc.setFontSize(12); //設定字體大小(optional)
    doc.text(
      `${pageCurrent} / ${pageNumber}`,
      190,
      doc.internal.pageSize.height - 10,
      { align: "left" },
    );
  }

  // 下載 PDF
  doc.save("User.pdf");
};
export { exportToExcel, exportToPdf };
