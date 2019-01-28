const http = require('http');
const https = require('https');
const fs = require('fs');

// const testUrl = 'http://193.112.89.116:8080/10/0245f6f55bcd';
// const testUrl = 'http://193.112.89.116:8080/6/02290aecc8f7';
const testUrl = 'http://193.112.89.116:8080/10/02fe2b57e5ae'; // big video from camera

const testDest = './testVideo.mp4';


const getFileNameFromUrl = (url) => {
	const split = url.split('/');
	const { length } = split;
	return split[length - 1];
};

/**
 *
 * @param res
 * @param fileName
 * @param callback
 */
const handleDownload = (res, fileName, callback) => {
	const file = fs.createWriteStream(fileName, {});
	res.pipe(file);
	// console.log(res.headers);
	file.on('finish', () => {
		file.close();
		// console.log('download finish');
		if (callback) callback(fileName);
	}).on('error', (err) => {
		console.log(err);
	});
};

/**
 *
 * @param fileUrl
 * @param destFileName
 * @param callback
 */
const downloadHttps = (fileUrl, destFileName, callback) => {
	let fileName = destFileName;
	if (!destFileName) {
		fileName = getFileNameFromUrl(fileUrl);
	}
	https.get(fileUrl, (res) => handleDownload(res, fileName, callback));

};

const download = (fileUrl, destFileName, callback) => {
	let fileName = destFileName;
	if (!destFileName) {
		fileName = getFileNameFromUrl(fileUrl);
	}
	http.get(fileUrl, (res) => handleDownload(res, fileName, callback));
};

const readDownloadFile = () => {

};

const getSchemeFromUrl = (url) => {
	if (url.indexOf('https') === 0) {
		return 'https';
	}
	return 'http';
};

module.exports = {
	download,
	downloadHttps,
	getFileNameFromUrl,
	getSchemeFromUrl,
};
