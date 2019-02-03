


const httpGetUrl = (url, path, body) => {
    const getUrl = url + path;
    let bodyStr = '';
    const keys = Object.keys(body);
    const { length } = keys;
    keys.forEach((k, index) => {
        if (index < length - 1) {
            bodyStr += k+'='+body[k]+'&';
        } else {
            bodyStr += k+'='+body[k];
        }

    });
    return getUrl+'?'+bodyStr;
};

const invokeHttpCallback = (callback) => (res) => {
    if (res.statusCode !== 200) {
        console.log(`STATUS: ${res.statusCode}`);
    }
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    const chunks = [];
    res.on('data', (chunk) => {
        // console.log('on data ');
        chunks.push(chunk);
    });
    res.on('end', () => {
        const body = Buffer.concat(chunks);
        const str = body.toString();
        callback(str);
    });
    res.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
};

module.exports = {
    httpGetUrl,
    invokeHttpCallback,
};