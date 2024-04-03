const allMainCode = require("./code-main-list.json");
const allSubCode = require("./code-sub-list.json");

const {
  getDetailByMainCode,
  getResultBySubCode,
} = require("./src/http-handler");
const { saveToExcel } = require("./src/xlsx-generate");


// getResultBySubCode('AUS-20240329-usUa-218354');
// getDetailByMainCode("AUM-20240329-Ud26-099793");


const generateDataLoop = async (index = 0, rows = []) => {
  if (index >= allMainCode.length) return rows;
  const mainCode = allMainCode[index];
  const subCode = allSubCode[index];
  console.log("index: ", index, ", main code ", mainCode);

  const detail = await getDetailByMainCode(mainCode);
  const testResult = await getResultBySubCode(subCode);

  const row = getScriptDataFromDetail(detail);

  const reportUrl = `https://idsaas-o.tclking.com/page/web-autotest-unite/#/result-manage/tv/performance/result?subCode=${subCode}`;
  row.push(reportUrl);

  const coldStartCase = getCodeStartResult(testResult);
  if (coldStartCase) {
    row.push(coldStartCase);
    rows.push(row);
  }

  return await generateDataLoop(index + 1, rows);
};

const main = () => {
  // generateDataLoop()
  //   .then((result) => {
  //     console.log("result length = ", result.length);
  //     // fs.writeFileSync("result.json", JSON.stringify(result));
  //     saveToExcel(result);
  //   })
  //   .catch((err) => {
  //     console.log("generate data loop error ", err);
  //   });

  const table = [];
  let index = 0;
  const taskList = require("./task-detail.json");
  const reportList = require("./report-detail.json");

  // const max = allMainCode.length;
  // while (index < max) {
  //   const detail = taskList[index];
  //   const report = reportList[index];

  //   const subCode = allSubCode[index];

  //   const row = getScriptDataFromDetail(detail);
  //   const reportUrl = `https://idsaas-o.tclking.com/page/web-autotest-unite/#/result-manage/tv/performance/result?subCode=${subCode}`;
  //   row.push(reportUrl);

  //   const coldStartCase = getCodeStartResult(report);
  //   if (coldStartCase) {
  //     row.push(coldStartCase);
  //     table.push(row);
  //   }

  //   index += 1;
  // }

  // saveToExcel(table);
};

