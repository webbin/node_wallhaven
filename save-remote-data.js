const fs = require("fs");

const { getDetailByMainCode, getResultBySubCode } = require("./main");

const allMainCode = require("./code-main-list.json");
const allSubCode = require("./code-sub-list.json");

const saveTaskDetailLoop = async (index = 0, list = []) => {
  if (index >= allMainCode.length) return list;
  const mainCode = allMainCode[index];
  console.log("save  ", index, " main code : ", mainCode);

  const detail = await getDetailByMainCode(mainCode);
  list.push(detail);
  return await saveTaskDetailLoop(index + 1, list);
};

const saveReportLoop = async (index = 0, list = []) => {
  if (index >= allSubCode.length) return list;
  const subCode = allSubCode[index];
  console.log("save  ", index, " sub code : ", subCode);

  const testResult = await getResultBySubCode(subCode);

  list.push(testResult);
  return await saveReportLoop(index + 1, list);
};

const startSave = () => {
  saveTaskDetailLoop()
    .then((result) => {
      fs.writeFileSync("task-detail.json", JSON.stringify(result));
      return saveReportLoop();
    })
    .then((result) => {
      fs.writeFileSync("report-detail.json", JSON.stringify(result));
    })
    .catch((err) => {
      console.log("save data error ", err);
    });
};

startSave();
