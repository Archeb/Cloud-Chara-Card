const handleWorld = (worldJson) => {
    var cloudWorld = {};
    for (const key of Object.keys(worldJson.entries)) {
        // create a new entry
        const newKey = randomString(10);
        cloudWorld[newKey] = {
            content: worldJson.entries[key].content
        };
        worldJson.entries[key].content = `<ccc-world>${newKey}</ccc-world>`;
    }
    return {worldJson, cloudWorld};
}

window.processChar = (charJson) => {
    var cloudChar = {};
    cloudChar.name = charJson.name;
    cloudChar.cloudNote = "";
    cloudChar.description = charJson.description;
    cloudChar.personality = charJson.personality;
    cloudChar.scenarios = charJson.scenario;
    cloudChar.mes_example = charJson.mes_example;

    charJson.description = `<ccc-description />
<ccc-api>这里填入你的API或者反代地址</ccc-api>
<ccc-api-key>这里填入你的Key</ccc-api-key>`;
    charJson.data.description = charJson.description;
    charJson.personality = "<ccc-personality />";
    charJson.data.personality = charJson.personality;
    charJson.scenarios = "<ccc-scenarios />";
    charJson.data.scenarios = charJson.scenarios;
    charJson.mes_example = "<ccc-mes_example />";
    charJson.data.mes_example = charJson.mes_example;

    if(charJson.data?.character_book) {
        // handle character_book
        var {worldJson, cloudWorld} = handleWorld(charJson.data.character_book);
        charJson.data.character_book = worldJson;
        cloudChar.cloudWorld = cloudWorld;
    }
    return {charJson, cloudChar};
}

window.generateDeployCode = () => {
    if (window.cloudChar) {
        cloudChar.cloudNote = document.getElementById("cloud-note").value;
        document.getElementById("cloud-char-worker-code").innerHTML = "const cloudCharaCard = " + JSON.stringify(cloudChar, null, 4) + b64DecodeUnicode(worker_template);
    } else {
        document.getElementById("cloud-char-worker-code").innerHTML = "请先选择角色卡。";
    }
}

const b64DecodeUnicode = (str) => {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
const randomString = (e) => {    
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}