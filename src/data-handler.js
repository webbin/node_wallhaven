const allScripts = require("../all-scripts.json");

const getSubCodeFromExecDetail = (detail) => {
  let code;
  const { deviceExecuteVOS } = detail;
  
  if (deviceExecuteVOS && deviceExecuteVOS[0]) {
    const { subCode } = deviceExecuteVOS[0];
    code = subCode;
  }
  return code;
}

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

module.exports = {
  getScriptFullPathById,
  getScriptDataFromDetail,
  getSubCodeFromExecDetail,
  getCodeStartResult,
};
