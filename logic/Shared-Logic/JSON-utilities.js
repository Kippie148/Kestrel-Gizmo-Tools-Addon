const fs = require('fs').promises
const { existsSync } = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '../../cache');

//===================
// Specific features
//===================

async function checkMainCacheLength() {
    const mainCachePath = path.join(cachePath, 'main_cache.json');
    const data = await loadFile(mainCachePath);
    if(data.indexed.length >= 288) {
        return true;
    }
    return false;
}

async function updateModJSON (path, key) {
    try {
        const data = await loadFile(path, {});
        data.addons[key] = true;
        await saveFile(path, data);

        return true;
    } catch(err) {
        console.log('Adding extension to existing mod failed: ', err);
        return false;
    }
}

//====
// IO
//====

async function loadFile (filePath, fallback) {
    if(!existsSync(filePath)) {
        console.log('The file given does not exist so it can not be opend.');
        return fallback;
    }
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.log('fallback used.', err);
        return fallback;
    }
}

async function saveFile(filePath, data) {
    if(!existsSync(filePath)) {
        console.log('Write could not be completed because of a bad file path');
        return false;
    }

    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch {
        console.log('Could not succesfully write json file');
        return false;
    }

    return true;
}

module.exports = {
    feature: {
        cacheCheck: checkMainCacheLength,
        updateJson: updateModJSON
    },
    io: {
        load: loadFile,
        write: saveFile
    }
}