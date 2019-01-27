const lodash = require('lodash');
const https = require('https');

const downloadUtil = require('./download-file');


const pageHtmlCallback = (res, list, done) => {
	// console.log(`STATUS: ${res.statusCode}`);
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
	});
};

const getPageList = (pageList, callback) => {
	const pageHtmlList = [];
	const done = lodash.after(pageList.length, () => {
		console.log('page count = ', pageHtmlList.length);
		callback(pageHtmlList);
	});
	pageList.forEach((url) => {
		https.get(url, (res) => pageHtmlCallback(res, pageHtmlList, done))
	});
};


const multiDownload = (scheme = 'http', urlList, callback) => {
	const done = lodash.after(urlList.length, () => {
		console.log('download '+urlList.length+' file completely');
		if (callback) callback();
	});
	urlList.forEach((url) => {
		const fileName = downloadUtil.getFileNameFromUrl(url);
		if (scheme === 'https') {
			downloadUtil.downloadHttps(url, fileName, done);
		} else if (scheme === 'http') {
			downloadUtil.download(url, fileName, done);
		} else {
			console.error('scheme unknown');
			done();
		}
	});
};

module.exports = {
	getPageList,
	multiDownload,
};
