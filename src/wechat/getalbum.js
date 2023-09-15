const axios = require("axios");
const { urlParser } = require("./parse_html");
const fs = require('fs');

const URL = "https://mp.weixin.qq.com/mp/appmsgalbum";

const MetroStations = ["大学城", "深圳北", "民治"];

// 2023-04-16 23:54:55
const SearchTimeEnd = 1681660495;

const generateParams = (msgid, itemidx, count = 10) => {
  const data = {
    action: "getalbum",
    __biz: "Mzg2MjgyMzI2OA==",
    album_id: "2830997749436465153",
    count,
    begin_msgid: msgid,
    begin_itemidx: itemidx,
    __biz: "Mzg2MjgyMzI2OA%3D%3D",
    x5: "0",
    f: "json",
  };
  const list = Object.keys(data).map((key) => {
    const value = data[key];
    return `${key}=${value}`;
  });
  return list.join("&");
};

const sendRequest = (msgid, itemidx, count = 10) => {
  const url = `${URL}?${generateParams(msgid, itemidx, count)}`;
  console.log("send request url = ", url);
  return axios.default.get(url, {
    headers: {},
  });
};

// sendRequest(0, 20)
//   .then((result) => {
//     // console.log(result.data);
//     const list = result.data.getalbum_resp.article_list;
//     console.log(list.length);
//     // "cover_img_1_1": "https://mmbiz.qpic.cn/sz_mmbiz_jpg/nibwAXb7BL26pchhOwO5wO8oyeqOG75zD7N1bgUqNzRGXKykdKE2dtHmlsg6ZJE8aibiaBXiaaV2sB2oumFOltDSicw/300",
//     // "create_time": "1692189226",
//     // "is_pay_subscribe": "0",
//     // "is_read": "0",
//     // "itemidx": "5",
//     // "key": "3862823268_2247557471_5",
//     // "msgid": "2247557471",
//     // "title": "【龙华区-龙岗区转租】12则-白石龙-龙胜-民治-元芬-五和-丹竹头-布吉地铁站/个人转租房源！（转租客可补贴）",
//     // "tts_is_ban": "0",
//     // "url": "http://mp.weixin.qq.com/s?__biz=Mzg2MjgyMzI2OA==&mid=2247557471&idx=5&sn=b5a85ce1923a975e00faa388620f33e4&chksm=ce025754f975de427be7ecf01f556a7e490e8ca410cf2d45f16dcedc6ef89c8c35c992666f09#rd",
//     // "user_read_status": "0"
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const fetchHtml = async (list) => {
  const promiseList = [];
  list.forEach((item) => {
    const { title = "" } = item;
    // console.log('title = ', title);

    let isTarget = false;
    for (let i = 0; i < MetroStations.length; i += 1) {
      const station = MetroStations[i];
      if (title.indexOf(station) >= 0) {
        console.log("title = ", title);
        console.log("url = ", item.url);
        promiseList.push(urlParser(item.url, MetroStations));
        isTarget = true;
        break;
      }
    }
  });

  const res = await Promise.all(promiseList);
  // console.log("promise list res = ", res);

  const l = [];
  res.forEach((item) => {
    l.push(...item);
  });

  console.log("htmls list res = ", l);
  return l;
};

const searchArticals = async () => {
  let endtime = -1;
  let idx = "";
  let msgid = "";
  const count = 10;

  const result = [];

  try {
    while (endtime === -1 || endtime > SearchTimeEnd) {
      const res = await sendRequest(msgid, idx, count);
      const list = res.data.getalbum_resp.article_list;
      if (!list || !list.length) {
        console.log(res.data);
      }

      const last = list[list.length - 1];
      // console.log('last = ', last);

      endtime = parseInt(last.create_time, 10);
      result.push(...await fetchHtml(list));

      msgid = last.msgid;
      idx = last.itemidx;

      // endtime = 0;
    }

    // console.log(articals);

    fs.writeFileSync('./data.json', JSON.stringify(result));

  } catch (error) {
    console.log(error);
  }
};

searchArticals();

// const url = "http://mp.weixin.qq.com/s?__biz=Mzg2MjgyMzI2OA==&mid=2247557471&idx=5&sn=b5a85ce1923a975e00faa388620f33e4&chksm=ce025754f975de427be7ecf01f556a7e490e8ca410cf2d45f16dcedc6ef89c8c35c992666f09#rd";
// sectionFilter(url)
