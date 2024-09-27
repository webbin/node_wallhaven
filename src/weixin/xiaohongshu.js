const puppeteer = require("puppeteer");
const fs = require("fs");
const jsonHandler = require("../../json-handler");

function log() {
  console.log(new Date().toLocaleTimeString(), ...arguments);
}

const BROWSER_PATH =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const WIDTH = 1280;
const HEIGHT = 720;

const Count = 10;
const ImageUrlList = [];

const waitTime = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

/**
 *
 * @param {puppeteer.ElementHandle<HTMLImageElement>} imgHandler
 */
const parseImgHandler = async (imgHandler) => {
  const imgUrl = await imgHandler.evaluate((el) => {
    return el.src;
    // return el.getAttribute("src");
  });
  return imgUrl;
};

/**
 * @param {puppeteer.Page} page
 */
const startLoadMainPage = async (page) => {
  const url = "https://www.xiaohongshu.com/explore";
  let list = [];

  await page.goto(url, {
    // waitUntil: "load",
    //     'load' - 页面的load事件触发完毕（即所有资源加载完毕）。
    // 'domcontentloaded' - DOMContentLoaded事件触发时（即初始HTML文档完全加载和解析）。
    // 'networkidle0' - 在500毫秒内没有任何网络连接。
    // 'networkidle2' - 在500毫秒内不超过 2 个网络连接。
    waitUntil: "domcontentloaded",
  });
  // await waitTime(5000);

  // const imgHandlerList = await page.$$("section.note-item");
  const imgHandlerList = await page.$$("section img");
  // log("imgHandlerList", imgHandlerList);
  if (imgHandlerList && imgHandlerList.length > 0) {
    log("image handler list:", imgHandlerList.length);

    const promiseList = [];
    for (let i = 0; i < imgHandlerList.length; i++) {
      const imgHandler = imgHandlerList[i];
      promiseList.push(parseImgHandler(imgHandler));
    }
    list = await Promise.all(promiseList);
    log("urls:", list.length);
  } else {
    log("no image handler list");
  }
  return list;
};

/**
 * @param {puppeteer.Page} page
 */
const loadExplorePageLoop = async (page) => {
  let i = 0;

  while (i < Count) {
    const list = await startLoadMainPage(page);
    ImageUrlList.push(
      ...list.filter((url) => {
        return !ImageUrlList.includes(url);
      })
    );
    i++;
  }
  console.log("ImageUrlList length:", ImageUrlList.length);
  jsonHandler.saveTextToFile(
    "./xiaohongshu_imgs.json",
    JSON.stringify(ImageUrlList)
  );
};

const launch = async () => {
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: false,
  });
  log("launch browser");
  try {
    const page = await browser.newPage();
    log("create new page");
    // Set screen size
    await page.setViewport({ width: WIDTH, height: HEIGHT });
    log("set viewport");
    await loadExplorePageLoop(page);
  } catch (error) {
    log("load page error ", error);
  }

  await browser.close();
};

const main = () => {
  launch()
    .then(() => {
      log("lanch done");
    })
    .catch((err) => {
      log("lanch error: ", err);
    });
};

main();
