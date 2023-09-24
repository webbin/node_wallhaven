const fs = require("fs");

const styleTemplate = `<style>

  .item {
    background-color:#cdf;
    margin: 30px 20px;
    border-radius:12px;
    padding: 30px 20px;
  }

  .url {
    word-wrap: break-word;
  }

  .image_url {
    word-wrap: break-word;
  }
  
</style>`;

const BLACK_LIST = ["步梯", "小单间", "2房", "两房"];

const handleTitle = (title = "") => {
  const list = title.split("【");
};

const generateItem = (item = []) => {
  let images = [];

  for (let i = 2; i < item.length; i += 1) {
    images.push(`<a class="image_url" target="_blank" href="${item[i]}">${item[i]}</a>`);
  }

  return `
  <div class="item">
    <a class="url" href="${item[0]}" target="_blank">${item[0]}</a>
    <p class="title">${item[1]}</p>
    ${images.join('\n')}
  </div>\n
  `;
};

const isInBlackList = (title = "") => {
  for (let i = 0; i < BLACK_LIST.length; i += 1) {
    const word = BLACK_LIST[i];
    if (title.indexOf(word) >= 0) {
      return true;
    }
  }
  return false;
};

// [html_page_url, title, image1,image2,...]
const generateHtml = (list = []) => {
  let body = "";

  console.log("data list length = ", list.length);
  let count = 0;
  list.forEach((item) => {
    const title = item[1];
    if (isInBlackList(title)) return;
    const element = generateItem(item);
    body += element;
    count += 1;
  });
  console.log('after filter: ', count);

  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${styleTemplate}
    <title>Document</title>
  </head>
  <body>
    ${body}
  </body>
  </html>
`;

  fs.writeFileSync("page.html", template);
};

const generateHtmlFromJson = () => {
  const data = fs.readFileSync("./data.json").toString();
  console.log("read json , content length = ", data.length);
  generateHtml(JSON.parse(data));
};

generateHtmlFromJson();
