const fs = require('fs');


const filePath = './source/wallhaven-739129.jpg';

const exist = fs.existsSync(filePath);
console.log('file exist ? ', exist);