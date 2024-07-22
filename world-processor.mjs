import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const world = fs.readFileSync('', 'utf8');
let worldJson;
let cloudWorld = {};
try {
    worldJson = JSON.parse(world);
    console.log(`已读取 ${Object.keys(worldJson.entries).length} 个世界书条目`);
} catch (e) {
    console.error(e);
    process.exit(1);
}
// go through entries
for (const key of Object.keys(worldJson.entries)) {
    // create a new entry
    const newKey = uuidv4();
    cloudWorld[newKey] = {
        content: worldJson.entries[key].content
    };
    worldJson.entries[key].content = `<ccc-world>${newKey}</ccc-world>`;
}
// write to file
fs.writeFileSync('', JSON.stringify(worldJson, null, 2));
fs.writeFileSync('cloud-characard-worker/src/cloudWorld.js', "export const cloudWorld = " + JSON.stringify(cloudWorld, null, 2));