const parser = require("parse5");
const axios = require("axios").default;
const fs = require("fs");

const Seperator = "/---- ==== Sepeartor ==== ----/";
const IMG_Seperator = " ===IMAGE=== ";

const Post_Start = "【位置】";

let temp = [];
function traverNode(node, result) {
  const { nodeName, tagName, name, childNodes, parentNode, attrs } = node;
  const ele = tagName || name || nodeName;
  // console.log("current tag: ", ele);

  // if (ele === "video") {
  //   console.log(node);
  // }

  // if (attrs) {
  //   for (let i = 0; i < attrs.length; i += 1) {
  //     const { name, value } = attrs[i];
  //     if (name === "src" && value.startsWith("http://mpvideo")) {
  //       // temp.push(IMG_Seperator, value);
  //       console.log(node);
  //       break;
  //     }
  //   }
  // }

  if (childNodes && childNodes.length) {
    childNodes.forEach((item) => {
      traverNode(item, result);
    });
  } else {
    if (ele === "#text") {
      const parentEle = parentNode.tagName || parentNode.nodeName;
      const content = node.value.trim();
      if (parentEle === "p") {
        if (content) {
          if (content.startsWith(Post_Start)) {
            result.push(temp.join(""));
            temp = [];
          }
          temp.push(content);
        }
      } else if (parentEle === "h1") {
        console.log(content);
      }
      // console.log(node);
    } else if (ele === "img") {
      for (let i = 0; i < attrs.length; i += 1) {
        const { name, value } = attrs[i];
        if (name === "data-src") {
          temp.push(IMG_Seperator, value);
          // console.log(value);
          break;
        }
      }
    } else if (ele === "em") {
      for (let i = 0; i < attrs.length; i += 1) {
        const { name, value } = attrs[i];
        if (name === "id" && value === "publish_time") {
          // temp.push(IMG_Seperator, value);
          // console.log(parentNode);
          break;
        }
      }
    }
  }
}

const urlParser = async (url, keywords) => {
  temp = [];
  const res = await axios.get(url);
  console.log("\n", "parse url: ", url);
  console.log("res length: ", res.data.length);
  // fs.writeFileSync('./page.html', res.data);

  const document = parser.parse(res.data);

  let result = [];
  traverNode(document, result);
  if (temp.length) {
    result.push(temp.join(""));
    temp = [];
  }

  // console.log("parse result ====================================");
  // console.log(result);
  // console.log("parse result ====================================");

  const list = [];
  for (let i = 0; i < result.length; i += 1) {
    const str = result[i];
    if (str.startsWith(Post_Start)) {
      const items = str.split(IMG_Seperator);
      const text = items[0];

      for (let j = 0; j < keywords.length; j += 1) {
        const key = keywords[j];
        if (text.indexOf(key) > 0) {
          list.push(items);
          break;
        }
      }
    }
  }

  // console.log("====================================");
  if (!list.length) {
    console.log("length = 0, result = ", result);
  }
  // console.log("====================================");
  return list;
};

const main = async () => {
  const url =
    "https://mp.weixin.qq.com/s?__biz=Mzg2MjgyMzI2OA==&mid=2247533577&idx=4&sn=4561de82a993187956baac2217b6a106&chksm=ce03f202f9747b143c0d7d8b3b4c5f93e0c35f20c15a21d13d39387128e04cd759a9e8191ff8#rd";

  urlParser(url, ["民治"]);
};

// main();

module.exports = {
  urlParser,
};
