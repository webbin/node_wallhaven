const http = require('http');
const https = require('https');
const fs = require('fs');

const multipleAsync = require('./multiple-async');
const downloadUtil = require('./download-file');
const httpUtil = require('./http-util');

const wallhavenHost = 'https://alpha.wallhaven.cc';
const searchPath = '/search';

const getBody = (query, page) => {
	return {
		q: query,
		page,
	};
};

const matchImgUrl = (str) => {
	const matchList = str.match(/src="\/\/wallpapers\.wallhaven\.cc\S+?\.jpg"/g);
	if (matchList && matchList[0]) {
		const result = matchList[0];
		let imgUrl = result.replace('src="', '').replace('"', '');
		imgUrl = 'https:'+imgUrl;
		// console.log('img path = ', imgUrl);
		return imgUrl;
	}
	return null;
};

const getPageListFromEnterPage = (str) => {
	const matchList = str.match(/https:\/\/alpha.wallhaven.cc\/wallpaper\/\d+?"/g);
	const pageList = [];
	matchList.forEach((item) => {
		const path = item.replace('"', '');
		pageList.push(path);
	});
	return pageList;
};

const matchImgPage = (str, callback) => {
	const pageList = getPageListFromEnterPage(str);
	// console.log('match page list', pageList.length);
	multipleAsync.getPageList(pageList, (htmlList) => {
		const imgUrlList = [];
		htmlList.forEach((html) => {
			const imgUrl = matchImgUrl(html);
			if (imgUrl) imgUrlList.push(imgUrl);
		});
		console.log(imgUrlList.length);
		if (callback) callback(imgUrlList);
	});
};

const startGetImgFile = (page = 1) => {
	if (page > 3) return;
	const dir = './source';
	const url = httpUtil.httpGetUrl(wallhavenHost, searchPath, getBody('anime', page));
	console.log('url = ', url);
	https.get(url, (res) => {
		const chunks = [];
		res.on('data', (chunk) => {
			// console.log('data ', chunk);
			chunks.push(chunk);
		});

		res.on('end', () => {
			const body = Buffer.concat(chunks);
			const html = body.toString();
			matchImgPage(html, (urlList) => {
				console.log('url to download ', urlList);
				multipleAsync.multiDownload(urlList, dir,() => {
					console.log('download complete ');
					startGetImgFile(page + 1);
				});
			});
		});
		res.on('error', (e) => {
			console.error(`${url} problem with request: ${e.message}`);
		});
	});
};

const fileUrl = 'http://vodkgeyttp8.vod.126.net/cloudmusic/432b/core/83de/39d32c31be670c70b6c8c800630f8762.mp4?wsSecret=47234cf4a250d080b8425a4cb5f7920a&wsTime=1548585118';
const fileName = 'mv.mp4';

const bigVideoUrl = 'http://193.112.89.116:8080/9/1b95ca440c11';
const bigVidwoName = 'ad.mp4';

const wallpaperUrl = 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-739173.jpg';
const filename = downloadUtil.getFileNameFromUrl(wallpaperUrl);
const wallpaperName = './source/'+filename;

// downloadUtil.downloadHttps(wallpaperUrl, wallpaperName);
// startGetImgFile();


const onfetchPageResult = (result) => {
	// console.log('fetch page end ', result.length);
	const imgUrl = matchImgUrl(result);
	if (imgUrl) {
		const fileName = downloadUtil.getFileNameFromUrl(imgUrl);
		const filePath = './source/'+fileName;
		const isExist = fs.existsSync(filePath);
		if (!isExist) {
			downloadUtil.downloadHttps(imgUrl, filePath, () => {
				console.log('this file not exist, download done ', fileName);
			});
		}
	}
};

const matchUrlInPage = (result) => {
	const pageList = getPageListFromEnterPage(result);
	pageList.forEach((url) => {
		const req = https.get(url, httpUtil.invokeHttpCallback(onfetchPageResult));
		req.on('information', (res) => {
			console.log(`Got information prior to main response: ${res.statusCode}`);
		});
		req.on('abort', (res) => {
			console.log(`on request abort : ${res.statusCode}`);
		});
		req.on('timeout', (res) => {
			console.log(`on request timeout : ${res.statusCode}`);
		});
	});
};

const testWallHavenNetwork = (page = 1) => {
	const url = httpUtil.httpGetUrl(wallhavenHost, searchPath, getBody('anime', page));
	console.log('test page url = ', url);
	const req = https.get(url, httpUtil.invokeHttpCallback(matchUrlInPage));
	req.on('information', (res) => {
		console.log(`Got information prior to main response: ${res.statusCode}`);
	});
	req.on('abort', (res) => {
		console.log(`on request abort : ${res.statusCode}`);
	});
	req.on('timeout', (res) => {
		console.log(`on request timeout : ${res.statusCode}`);
	});
};

testWallHavenNetwork();