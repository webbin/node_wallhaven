const http = require('http');
const https = require('https');

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

const matchImgPage = (str) => {
	const matchList = str.match(/https:\/\/alpha.wallhaven.cc\/wallpaper\/\d+?"/g);

	matchList.forEach((item) => {

	});
	// console.log('match list', matchList);
};


const httpCallback = (res) => {
	console.log(`STATUS: ${res.statusCode}`);
	console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	const chunks = [];

	res.on('data', (chunk) => {
		// console.log('data ', chunk);
		chunks.push(chunk);
	});

	res.on('end', () => {
		const body = Buffer.concat(chunks);
		matchImgPage(body.toString());
	});
	res.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});
};

const url = httpGetUrl(wallhavenHost, searchPath, getBody('anime', 1));
console.log('url = ', url);
const req = https.get(url, httpCallback);

req.end();
