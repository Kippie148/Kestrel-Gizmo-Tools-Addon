const fs = require('fs').promises;
const { existsSync, mkdirSync, writeFileSync } = require('fs');
const path = require('path');
const helpers = require('../Shared-Logic/JSON-utilities');

const CACHE_FOLDER_PATH = path.join(__dirname, '../../cache');

const PATHS = {
    recent: path.join(CACHE_FOLDER_PATH, 'recent_cache.json'),
    main: path.join(CACHE_FOLDER_PATH, 'main_cache.json'),
    mod: path.join(CACHE_FOLDER_PATH, 'opend_mod_cache.json'),
    map: path.join(CACHE_FOLDER_PATH, 'map_cache.json')
    // builder: path.join(CACHE_FOLDER_PATH, 'builder_cache')
};

//==============
// Check caches
//==============

function checkCaches () {
    try {
        if(!existsSync(CACHE_FOLDER_PATH)) {
            console.log('Cache folder could not be found. Installation error?');
            if(!makeCacheFolder()) {
                console.log('A problem occured while making the cache folder. Very weird. The program wil stop. Try again, look for problems in the files or consider a reinstall.');
                return false;
            }
        }
        if(!existsSync(PATHS.recent)) {
            console.log('The cache folder was found but no recent cache was found. Not a problem if you have not opened a file yet.');
            writeFileSync(PATHS.recent, JSON.stringify({ recent: [] }, null, 2));
        }
        if(!existsSync(PATHS.main)) {
            console.log('Warning: Cache folder and recent cache were found but the main cache is missing. This is weird behaviour if it is not the first time starting. So watch out for more problems left behind!')
            writeFileSync(PATHS.main, JSON.stringify({ indexed: [] }, null, 2));
        }
        console.log('All cache checks succesfully done.');
        return true;
    } catch {
        console.log('A problem occured while trying to generate the cache files. This is not fatale but be aware possible unstable behaviour.');
        return false;
    }
}

function makeCacheFolder () { 
    if(!mkdirSync(CACHE_FOLDER_PATH)) {
        return false;
    }
    return true;
}

//===========
// Mod cache
//===========

async function getModCache () {
    return helpers.io.load(PATHS.mod, { last: [] });
}

async function addToModCache (entry) {
    helpers.io.write(PATHS.mod, entry);
}

//==============
// Recent cache
//==============


async function getRecent () {
    return helpers.io.load(PATHS.recent, { recent: [] });
}

async function addRecent (filePath) {
    const data = await getRecent();
    let list = data.recent;

    list = list.filter(f => f.path !== filePath);

    list.unshift({
        path: filePath,
        name: path.basename(filePath),
        lastOpened: Date.now()
    });

    list = list.slice(0, 10);

    data.recent = list;
    if(!await helpers.io.write(PATHS.recent, data)) {
        return false;
    }

    return true;
}

//============
// Main cache
//============

async function getMain () {
    return await helpers.io.load(PATHS.main, { indexed: [] });
}

async function addToMain(filePath) {
    const data = await getMain();
    let list = data.indexed;

    list = list.filter(f => f.path !== filePath);

    list.unshift({
        path: filePath,
        name: path.basename(filePath),
    });

    data.indexed = list;
    if(!await helpers.io.write(PATHS.main, data)) {
        return false;
    }
    
    return true;
}

async function addBulk(entries) {
    let existingData = await getMain();

    const normalize = p => p.replace(/\\/g, '/').toLowerCase();

    const existingPaths = new Set(existingData.indexed.map(f => normalize(f.path)));
    const newEntries = entries.filter(f => !existingPaths.has(normalize(f.path)));

    const combined = [...existingData.indexed, ...newEntries];

    const seen = new Set();
    existingData.indexed = combined.filter(f => {
        const key = normalize(f.path);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    if (!await helpers.io.write(PATHS.main, existingData)) {
        return false;
    }
    return true;
}

//===========
// Map Cache
//===========

async function getMapCache () {
    const store = await helpers.io.load(PATHS.map, {});
    return store;
}

async function createMapCache (obj) {
    writeFileSync(PATHS.map, JSON.stringify({}, null, 2));
    if(!helpers.io.write(PATHS.map, obj)) {
        return false;
    }

    return true;
}

//===============
// Builder cache
//===============
// Possible to complete if performance hit is to high and auto feature is needed. Wait for feedback first.

// async function getBuilderCache () {
// await loadFile(PATHS.builder, { builderEntries: [] })
//}

// function addToBuilderCache (data) {
//     await saveFile(data);
//     return true;
// }

//=========
// Exports
//=========
module.exports = {
    init: {
        check: checkCaches,
        makeFolder: makeCacheFolder
    },
    recent: {
        get: getRecent,
        add: addRecent
    },
    main: {
        get: getMain,
        add: addToMain,
        bulk: addBulk
    },
    map: {
        get: getMapCache,
        add: createMapCache
    },
    mod: {
        get: getModCache,
        write: addToModCache
    }
};