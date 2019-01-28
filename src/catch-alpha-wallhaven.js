const http = require('http');
const https = require('https');

const multipleAsync = require('./multiple-async');
const downloadUtil = require('./download-file');

const wallhavenHost = 'https://alpha.wallhaven.cc';
const searchPath = '/search';

const getBody = (query, page) => {
	return {
		q: query,
		page,
	};
};

const httpGetUrl = (url, path, body) => {
	const getUrl = url + path;
	let bodyStr = '';
	const keys = Object.keys(body);
	keys.forEach((k) => {
		bodyStr += k+'='+body[k]+'&';
	});
	return getUrl+'?'+bodyStr;
};

const matchImgUrl = (str) => {
	const matchList = str.match(/src="\/\/wallpapers\.wallhaven\.cc\S+?\.jpg"/g);
	if (matchList && matchList[0]) {
		const result = matchList[0];
		let imgUrl = result.replace('src="', '').replace('"', '');
		imgUrl = 'https:'+imgUrl;
		console.log('img path = ', imgUrl);
		return imgUrl;
	}
	return null;
};

const matchImgPage = (str, callback) => {
	const matchList = str.match(/https:\/\/alpha.wallhaven.cc\/wallpaper\/\d+?"/g);
	const pageList = [];
	matchList.forEach((item) => {
		const path = item.replace('"', '');
		pageList.push(path);
	});
	// console.log('match list', pageList);
	multipleAsync.getPageList(pageList, (htmlList) => {
		const imgUrlList = [];
		htmlList.forEach((html) => {
			const imgUrl = matchImgUrl(html);
			if (imgUrl) imgUrlList.push(imgUrl);
		});
		// console.log(imgUrlList.length);
		if (callback) callback(imgUrlList);
	});
};

const startGetImgFile = (page = 1) => {
	if (page > 10) return;
	const dir = './source';
	const url = httpGetUrl(wallhavenHost, searchPath, getBody('anime', page));
	// console.log('url = ', url);
	const req = https.get(url, (res) => {
		const chunks = [];
		res.on('data', (chunk) => {
			// console.log('data ', chunk);
			chunks.push(chunk);
		});

		res.on('end', () => {
			const body = Buffer.concat(chunks);
			const html = body.toString();
			matchImgPage(html, (urlList) => {
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
	req.end();
};

const fileUrl = 'http://vodkgeyttp8.vod.126.net/cloudmusic/432b/core/83de/39d32c31be670c70b6c8c800630f8762.mp4?wsSecret=47234cf4a250d080b8425a4cb5f7920a&wsTime=1548585118';
const fileName = 'mv.mp4';

const bigVideoUrl = 'http://193.112.89.116:8080/9/1b95ca440c11';
const bigVidwoName = 'ad.mp4';

const wallpaperUrl = 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-739173.jpg';
const filename = downloadUtil.getFileNameFromUrl(wallpaperUrl);
const wallpaperName = './source/'+filename;

// downloadUtil.downloadHttps(wallpaperUrl, wallpaperName);
startGetImgFile();
