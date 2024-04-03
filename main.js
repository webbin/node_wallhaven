const {
  getDetailByMainCode,
  getResultBySubCode,
  getTaskExecDetail,
} = require("./src/http-handler");

const {
  getScriptDataFromDetail,
  getSubCodeFromExecDetail,
  getCodeStartResult,
} = require("./src/data-handler");

const { saveToExcel } = require("./src/xlsx-generate");

const generateRecord = async (mainCode) => {
  const detail = await getDetailByMainCode(mainCode);
  const row = getScriptDataFromDetail(detail);

  const execDetail = await getTaskExecDetail(mainCode);

  const subCode = getSubCodeFromExecDetail(execDetail);
  if (subCode) {
    const reportUrl = `https://idsaas-o.tclking.com/page/web-autotest-unite/#/result-manage/tv/performance/result?subCode=${subCode}`;
    row.push(reportUrl);

    const report = await getResultBySubCode(subCode);

    const coldStartCase = getCodeStartResult(report);
    if (coldStartCase) {
      row.push(coldStartCase);
      return row;
    }
  }
  return undefined;
};

const main = () => {
  // const mainCode = "AUM-20240329-Ud26-099793";
  const list = require("./code-main-list.json");
  const table = [];

  const loop = async (index = 0) => {
    if (index >= list.length) {
      return;
    }
    const mainCode = list[index];
    console.log("generate record , index: ", index, ", code: ", mainCode);
    const row = await generateRecord(mainCode);
    if (row) {
      table.push(row);
    }
    await loop(index + 1);
  };

  loop()
    .then(() => {
      console.log("table length:", table.length);
      saveToExcel(table);
    })
    .catch((error) => {
      console.log("generate record error:", error);
    });
};

main();
