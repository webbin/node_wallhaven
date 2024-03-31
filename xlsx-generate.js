const ExcelJS = require("exceljs");

const saveToExcel = (table) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("My Sheet");

  sheet.columns = [
    { header: "主任务码", key: "mainCode" },
    { header: "任务名称", key: "taskName" },
    { header: "执行时间", key: "executeStartTime" },
    { header: "系统版本", key: "systemVersion" },
    { header: "设备型号", key: "model" },
    { header: "报告链接", key: "reportUrl" },
    // { header: "脚本id", key: "scriptId" },
    { header: "应用版本", key: "appData" },
    { header: "脚本名称", key: "scriptPath" },
    { header: "用例", key: "coldStartResult" },
  ];

  // worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
  // worksheet.addRow({ id: 2, name: "Jane Doe", dob: new Date(1965, 1, 7) });

  table.forEach((row) => {
    const [
      mainCode,
      taskName,
      executeStartTime,
      scriptId,
      scriptPath,
      appData,
      systemVersion,
      model,
      reportUrl,
      coldStartResult,
    ] = row;

    sheet.addRow({
      mainCode,
      taskName,
      executeStartTime,
      systemVersion,
      model,
      reportUrl,
      // scriptId,
      appData,
      scriptPath,
      coldStartResult,
    });
  });

  workbook.xlsx.writeFile("./result.xlsx");
};

module.exports = { saveToExcel };
