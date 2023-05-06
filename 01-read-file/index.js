const fs = require('fs');
const path = require('node:path');

const stream = fs.createReadStream(path.join('./01-read-file', 'text.txt'), 'utf-8');
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));
