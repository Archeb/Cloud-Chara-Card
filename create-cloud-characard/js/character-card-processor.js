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
    cloudChar.description = charJson.description;
    cloudChar.personality = charJson.personality;
    cloudChar.scenarios = charJson.scenario;
    cloudChar.first_mes = charJson.first_mes;
    cloudChar.mes_example = charJson.mes_example;

    charJson.description = "<ccc-description />";
    charJson.data.description = charJson.description;
    charJson.personality = "<ccc-personality />";
    charJson.data.personality = charJson.personality;
    charJson.scenarios = "<ccc-scenarios />";
    charJson.data.scenarios = charJson.scenarios;
    charJson.first_mes = "<ccc-first_mes />";
    charJson.data.first_mes = charJson.first_mes;
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

const randomString = (e) => {    
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}