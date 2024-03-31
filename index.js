const fs = require("fs");

const allMainCode = require("./code-main-list.json");
const allSubCode = require("./code-sub-list.json");
const allScripts = require("./all-scripts.json");

const { getDetailByMainCode, getResultBySubCode } = require("./main");
const { saveToExcel } = require("./xlsx-generate");

const getScriptFullPathById = (id) => {
  const list = allScripts.treeChildren;
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    if (element.fileId === id) {
      return element.fullPath;
    }
  }
  return undefined;
};

// getResultBySubCode('AUS-20240329-usUa-218354');
// getDetailByMainCode("AUM-20240329-Ud26-099793");

const getScriptDataFromDetail = (detail) => {
  const { testDevices, mainCode, apps, executeStartTime, taskName } = detail;

  let scriptId = "";
  let scriptPath = "";
  let appData = "";
  let systemVersion = "";
  let model = "";

  if (testDevices && testDevices[0]) {
    const { systemVersion: version, model: m, executeScripts } = testDevices[0];
    if (executeScripts && executeScripts[0]) {
      scriptId = testDevices[0].executeScripts[0].scriptId;
    }

    systemVersion = version;
    model = m;
  }

  if (scriptId) {
    scriptPath = getScriptFullPathById(scriptId);
  }

  if (apps && apps[0]) {
    const { packageName, versionName } = apps[0];
    appData = `${packageName} ${versionName}`;
  }

  return [
    mainCode,
    taskName,
    executeStartTime,
    scriptId,
    scriptPath,
    appData,
    systemVersion,
    model,
  ];
};

const getCodeStartResult = (result) => {
  // "testBoolValue": 1994,
  //               "testUpperQuartile": 2002.5,
  //               "testLowerQuartile": 1890.5,
  //               "testMedian": 1966.5,
  //               "testBaseValue": 1949.67,

  const { caseResults } = result;
  if (caseResults && caseResults[0]) {
    const {
      // 中分位
      testMedian,
      // 上四分位数
      testUpperQuartile,
      // 下四分位数
      testLowerQuartile,
      caseName,
    } = caseResults[0];
    if (testMedian && testUpperQuartile && testLowerQuartile) {
      return `${caseName}:\n中分位:${testMedian}\n上四分位数:${testUpperQuartile}\n下四分位数:${testLowerQuartile}`;
    }
  }

  return "";
};

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

  const max = allMainCode.length;
  while (index < max) {
    const detail = taskList[index];
    const report = reportList[index];

    const subCode = allSubCode[index];

    const row = getScriptDataFromDetail(detail);
    const reportUrl = `https://idsaas-o.tclking.com/page/web-autotest-unite/#/result-manage/tv/performance/result?subCode=${subCode}`;
    row.push(reportUrl);

    const coldStartCase = getCodeStartResult(report);
    if (coldStartCase) {
      row.push(coldStartCase);
      table.push(row);
    }

    index += 1;
  }

  saveToExcel(table);
};

main();
