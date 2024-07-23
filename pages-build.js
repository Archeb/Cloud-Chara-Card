const fs = require('fs');
const path = require('path');
// 读取 cloud-characard-worker/src/index.js

var cloudCharaCardWorker = fs.readFileSync(path.resolve(__dirname, './cloud-characard-worker/src/index.js'), 'utf-8');

// 进行编码
cloudCharaCardWorker = "const worker_template=\"" + Buffer.from(cloudCharaCardWorker).toString('base64') + "\";"; 

// 追加写入到 create-cloud-characard/js/character-card-processor.js.js
fs.appendFileSync(path.resolve(__dirname, './create-cloud-characard/js/character-card-processor.js.js'), cloudCharaCardWorker, 'utf-8');
