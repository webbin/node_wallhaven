const http = require('http');

const httpUtil = require('../http-util');
const multiAsync = require('../multiple-async');

const url = 'http://www.wallpapermaiden.com';

const path = '/category/anime';

const matchHtmlHref = (htmlStr) => {
    const reg = /<div class="wallpaperBg">\s+<a href="\S+?"/g;
    const matchResult = htmlStr.match(reg);
    const list = [];
    if (matchResult) {
        matchResult.forEach((item) => {
            const u = item.replace(/<div class="wallpaperBg">\s+<a href="/g, '').replace('"', '');
            list.push(u);
        });
    }
    return list;
};

const onGetMultiPage = (urlList, htmlList) => {
    // console.log('get html page ', htmlList[0].length);
    htmlList.forEach((htmlStr, index) => {
        if (index === 0) {
            const pageUrl = urlList[index];
            const regText = pageUrl+'\\S+\"';
            console.log('reg text ', regText);
            const reg = new RegExp(regText);
            const matchResult = htmlStr.match(reg);

            console.log('match result ', matchResult);
        }

    });
};

const onReqEnd = (str) => {
    console.log('req end ', str.length);
    const list = matchHtmlHref(str);
    console.log('match result ', list.length);
    multiAsync.getHttpPageList(list, (htmlList) => onGetMultiPage(list, htmlList));
};

const catchWallpaper = (page = 1) => {
    const body = { page };

    const destUrl = httpUtil.httpGetUrl(url, path, body);
    console.log('get url = ', destUrl);
    const callback = httpUtil.invokeHttpCallback(onReqEnd);
    const req = http.get(destUrl, callback);
    req.end();
};

catchWallpaper();
