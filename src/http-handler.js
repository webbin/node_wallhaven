const axios = require("axios").default;
const fs = require("fs");

const Cookie =
  "experimentation_subject_id=IjA3MzYxM2VkLTQ1NDEtNGZiOS1iY2FiLWM5ZDQyNTQxYWE2MiI%3D--84dc9bd18912cfbeb8bb31c7dd06ce7649836dfb; OUTFOX_SEARCH_USER_ID_NCOO=640973027.5581745; rhp=https://idsaas-o.tclking.com; JSESSIONID=25F92F7BB4B7D9ADAB20AF5B47C56540; return-url=https://idsaas-o.tclking.com/page/web-autotest-unite/#/task-manage/list";
const Token =
  "MGM3ZDY0NDJjMWU0NmM2MjJlYzE3OTgxMjcyMzAxMzQ1ZDFmN2IzOTAxMjdmNjBlODQ5YzllNWNjNzE0NTgzOA==";

const IDSASS_Header = {
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9",
  Connection: "keep-alive",
  Cookie,
  Host: "idsaas-o.tclking.com",
  Referer: "'https':'/idsaas-o.tclking.com/page/web-autotest-unite/'",
  "Sec-Ch-Ua": `"Google Chrome";v="123", "Not':'-Brand";v="8", "Chromium";v="123"'`,
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": "Windows",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "X-Csrf-Token": Token,
};

const getTaskExecDetail = async (code) => {
  const url = `https://idsaas-o.tclking.com/autotest-unite-cms/task/execute/detail?mainCode=${code}`
  const res = await axios.get(url, {
    headers: IDSASS_Header,
  });

  // console.log("detail: ", res.data.data);
  return res.data.data;
}

const getDetailByMainCode = async (code) => {
  // AUM-20240329-Ud26-099793
  const url = `https://idsaas-o.tclking.com/autotest-unite-cms/task/create/detail?mainCode=${code}`;

  const res = await axios.get(url, {
    headers: IDSASS_Header,
  });

  // console.log("detail: ", res.data.data);
  return res.data.data;
};

const getResultBySubCode = async (code) => {
  const url = `https://idsaas-o.tclking.com/autotest-unite-cms/result/performance/test/device/detail?subCode=${code}`;

  const res = await axios.get(url, {
    headers: IDSASS_Header,
  });

  // console.log("test result: ", res.data);
  // const { caseResults } = res.data.data;

  return res.data.data;
};

const Table = [];

const createTableHeader = () => {
  return ["主任务码", "脚本路径", "脚本名称"];
};

const createTableRow = (mainCode, scriptPath, scriptName) => {
  return [mainCode, scriptPath, scriptName];
};

const saveTable = () => {
  const filePath = "./table.json";
  fs.writeFileSync(filePath, JSON.stringify(Table));
};

module.exports = {
  getDetailByMainCode,
  getResultBySubCode,
  getTaskExecDetail,
};
