const lodash = require('lodash');
const https = require('https');
const http = require('http');

const downloadUtil = require('./download-file');


const pageHtmlCallback = (res, list, done) => {
	if (res.statusCode !== 200) {
		console.log(`STATUS: ${res.statusCode}`);
	}
	// console.log('page html current length = ', list.length);
	// console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	const chunks = [];
	res.on('data', (chunk) => {
		// console.log('data ', chunk);
		chunks.push(chunk);
	});
	res.on('end', () => {
		const body = Buffer.concat(chunks);
		const str = body.toString();
		list.push(str);
		done();
	});
	res.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
		done();
	});
};

const getPageList = (pageList, callback) => {
	const pageHtmlList = [];
	const done = lodash.after(pageList.length, () => {
		console.log('page count = ', pageHtmlList.length);
		callback(pageHtmlList);
	});

	pageList.forEach((url) => {
		const req = https.get(url, (res) => pageHtmlCallback(res, pageHtmlList, done));
		req.on('timeout', () => {
			done();
			console.log('time out');
		});
		req.on('error',() => {
			done();
			console.log('req error');
		})
	});
};

const getHttpPageList = (pageList, callback) => {
	const pageHtmlList = [];
	const done = lodash.after(pageList.length, () => {
		console.log('page count = ', pageHtmlList.length);
		callback(pageHtmlList);
	});
	pageList.forEach((url) => {
		const req = http.get(url, (res) => pageHtmlCallback(res, pageHtmlList, done));
		req.on('timeout', () => {
			console.log('time out');
			done();
		});
	});
};


const multiDownload = (urlList, dir,  callback) => {
	const done = lodash.after(urlList.length, () => {
		console.log('download '+urlList.length+' file completely');
		if (callback) callback();
	});
	urlList.forEach((url) => {
		const fileName = downloadUtil.getFileNameFromUrl(url);
		let filePath;
		if (dir) {
			filePath = dir + '/' + fileName;
		} else {
			filePath = fileName;
		}
		const scheme = downloadUtil.getSchemeFromUrl(url);
		if (scheme === 'https') {
			downloadUtil.downloadHttps(url, filePath, done);
		} else if (scheme === 'http') {
			downloadUtil.download(url, filePath, done);
		} else {
			console.error('scheme unknown');
			done();
		}
	});
};

module.exports = {
	getPageList,
	multiDownload,
	getHttpPageList,
};
