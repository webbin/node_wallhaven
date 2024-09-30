const axios = require("axios");
const { result } = require("lodash");

const generateUrl = (page = 1) => {
  return `https://baike.baidu.com/starmap/api/collectinfo?lemmaId=24533755&encodeRelId=1fc949135bd7921d63aa3971&pn=${page}&rn=50&productId=1`;
};

const headers = {
  Accept: "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  Connection: "keep-alive",
  Cookie: `BIDUPSID=888351938CAADE7209B100064D7BFA4F; PSTM=1695810283; ,BAIDUID=0E4E5E4EFF247A448A2508B3CD6ED6CB:SL=0:NR=10:FG=1; Hm_lvt_55b574651fcae74b0a9f1cf9c8d7c93a=1699862153,1701073758; BDUSS=JpM21EdU5ZWHk5NmxGUkwwdVRVTEN0Qi1GYkd3R34tUjFBYy1jT0ZkM3dYMjFtSVFBQUFBJCQAAAAAAAAAAAEAAAAwgGArv7Syu824c3RyYW5nZXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPDSRWbw0kVmOW; BDUSS_BFESS=JpM21EdU5ZWHk5NmxGUkwwdVRVTEN0Qi1GYkd3R34tUjFBYy1jT0ZkM3dYMjFtSVFBQUFBJCQAAAAAAAAAAAEAAAAwgGArv7Syu824c3RyYW5nZXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPDSRWbw0kVmOW; channel=baidusearch; H_WISE_SIDS_BFESS=60448_60470_60444_60492_60499; newlogin=1; MCITY=-%3A; BAIDUID_BFESS=0E4E5E4EFF247A448A2508B3CD6ED6CB:SL=0:NR=10:FG=1; ZFY=0l2AgnkN5EtwbNVNYEdRBD3ZVRm9CN3cl3VnA1QzvfM:C; H_PS_PSSID=60448_60786_60825_60839; H_WISE_SIDS=60448_60786_60825_60839; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; PSINO=6; delPer=0; RT="z=1&dm=baidu.com&si=71c802f0-bfae-476b-a29b-f404c6459f73&ss=m1n6lwei&sl=3&tt=49z&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=24d5&ul=2fiu&hd=2fix"; BA_HECTOR=008k2k0g85aka42g20810h2l97hr441jfkemg1v; baikeVisitId=91087147-06ae-4a2c-85a5-be6a21ee6a5c`,
  Host: "baike.baidu.com",
  Referer:
    "https://baike.baidu.com/starmap/view?fromModule=starMap_recommend&lemmaId=24533755&lemmaTitle=TCL%E5%AE%9E%E4%B8%9A%E6%8E%A7%E8%82%A1%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&nodeId=1fc949135bd7921d63aa3971&starMapFrom=lemma_starMap",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0",
  "X-Bk-Token":
    "eyJwYWdlVXJsIjoiL3N0YXJtYXAvdmlldyIsImV4cGlyZVRpbWUiOjE3Mjc2NzkwNTR9.azX0w7TT33OeY-T4NnWMZ-w4AOTwwEHO5wVW6SpkTaQ",
  "sec-ch-ua": `"Microsoft Edge";v="129 "Not=A?Brand";v="8", "Chromium";v="129"`,
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "Windows",
};

const main = async () => {
  try {
    let page = 1;
    const result = await axios.default.get(generateUrl(page), {
      headers,
    });
    console.log(result.data);
  } catch (error) {
    console.log(error);
  }
};

main();
