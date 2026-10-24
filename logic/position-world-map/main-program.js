const electron = require('electron');
const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const globalVars = require('../../../../global-variables');

const cache = require('../Shared-Logic/cache-manager');
const scanner = require('../Shared-Logic/file-path-scanner');
const parser = require('../Shared-Logic/giz-parser');

const mainCachePath = path.join(__dirname, '../../', 'cache');

let win;

let cacheEntryData = null;
let index = null;

//======
// Init
//======

async function init () {
    try {
        await checkCache();
        await getMapCacheData();
    } catch (err) {
        console.log('Init went wrong.', err);
        return false;
    }
}

async function checkCache () {
    if(!fs.existsSync(mainCachePath)) {
        fs.mkdirSync(mainCachePath);
    }
    if(!fs.existsSync(path.join(mainCachePath, 'map_cache.json'))) {
        console.log('The cache does not exist yet. \nGenerating...');
        await createMapCache();
        await sleep(10);
    }
}

//===========
// Map Cache
//===========

function getMapSection (headerName, key) {
    try {
        if(headerName !== 'RegularObjects' && headerName !== 'GizmoPickup') {
            return cacheEntryData[headerName];
        } else {
            return cacheEntryData[headerName][key];
        }
    } catch(err) {
        console.log('Entries could not be gathered.', err);
        return [];
    }
    
}

function getSectionLength (headerName) {
    return cacheEntryData[headerName].length;
    
}

function findFilePathByIndex (number) {
    return path.basename(index[number]);
}

async function getMapCacheData () {
    try {
        const rawCache = await cache.map.get();
        cacheEntryData = rawCache.data;
        index = rawCache.index;
        return true;
    } catch (err) {
        console.log('Could not get entry data.', err);
        return false;
    }
    
}

async function createMapCache () {
    const scanPathCity = path.join(globalVars.KFFolderPath, '..', 'LEVELS', 'LEGO_CITY', 'LEGO_CITY');

    if(!fs.existsSync(scanPathCity)) {
        return false;
    }

    const entries = await scanner.scanGizDir(scanPathCity);

    const object = {
        index: {},
        data: {
            GIZSIMPLEPROPOBJECT: [],
            GizObstacle: [],
            GizSpellIt: [],
            GizHint: [],
            TightRope: [],
            Door: [],
            Ledge: [],
            Ladder: [],
            Pole: [],
            Tube: [],
            Grapple: [],
            Techno: [],
            Blowup: [],
            Plug: [],
            GizSwitch: [],
            LightBeam: [],
            GizmoPickup: {
                71: [],
                80: [],
                98: [],
                102: [],
                103: [],
                104: [],
                106: [],
                112: [],
                113: [],
                114: [],
                115: [],
                118: [],
                122: [],
                default: []
            },
            RegularObjects: {
                GIZSIMPLEPROPOBJECT: [],
                GizObstacle: [],
                GizSpellIt: [],
                ComplexGizmo: [],
                GizSwitch: [],
                Blowup: [],
                GizItem: [],
                GizSuperBuild: [],
                PushBlocks2: []
            }
        }
    };

    let indexPos = 0;

    for(const entry of entries) {
        let content = {};

        object.index[indexPos] = entry.path;

        const data = await parser.parseGiz(entry.path);

        if(data.length === 0) {
            continue;
        }

        const headers = [...data.headers.short, ...data.headers.long];

        for(let i = 0; i < headers.length; i++) {
            let entriesData;

            const headerName = headers[i].name;

            if(headerName === 'RegularObjects') {
                entriesData = await getDataBySectionRegular(data.entries[i], indexPos);
            } else if (headerName === 'GizmoPickup') {
                entriesData = await getDataBySectionPickup(data.entries[i], indexPos);
            } else if (headerName === 'MiniCut' || headerName === 'GizCutscene' || headerName === 'Teleport' || headerName === 'PushBlocks2' || headerName === 'Painting' || headerName === 'GizDig' || headerName === 'ComplexGizmo') {
                continue;
            } else {
                entriesData = await getDataBySection(data.entries[i], indexPos);
            }

            entriesData.path = entry.path;

            if(headerName === 'RegularObjects') {
                for(const entryData of entriesData) {
                    object.data.RegularObjects[entryData.className].push(entryData);
                }
            } else if (headerName === 'GizmoPickup'){
                for(const entryData of entriesData) {
                    if(Object.hasOwn(object.data.GizmoPickup, entryData.typeSig)) {
                        object.data.GizmoPickup[entryData.typeSig].push(entryData);
                    } else {
                        object.data.GizmoPickup.default.push(entryData);
                    }
                }
            } else {
                for(const entryData of entriesData) {
                    object.data[headerName].push(entryData);
                }
                
            }
        }

        indexPos++;
    }

    if(!cache.map.add(object)) {
        return false;
    }
}

async function getDataBySection (entries, indexPos) {
    const results = [];
    
    for(const entry of entries) {
        let name;
        let position = [];
        
        if(Object.hasOwn(entry, 'name')) {
            name = entry.name;
        } else {
            name = entry.ending.name;
        }

        if(Object.hasOwn(entry, 'coords')) {
            position = await optimiseCoords(entry.coords);
        } else {
            position = await optimiseCoords(entry.ending.coords);
        }

        results.push({ name: name, coords: position, index: indexPos });
    }

    return results;
}

async function getDataBySectionRegular (entries, indexPos) {
    const results = [];

        for(let j = 0; j < entries.length; j++) {
            let name;
            let className;
            let coords;

        name = entries[j].name;

        className = entries[j].className;

        coords = await optimiseCoords(entries[j].coords);

        results.push({ name: name, className: className, coords: coords, index: indexPos });
    }

    return results;
}

async function getDataBySectionPickup (entryData, indexPos) {
    const results = [];

    const { entries } = entryData;

    for(let i = 0; i < entries.length; i++) {
        let name;
        let typeSig;
        let coords;

        name = entries[i].ending.name;
        typeSig = entries[i].typeSig
        coords = await optimiseCoords(entries[i].ending.coords);

        results.push({ name: name, typeSig: typeSig, coords: coords, index: indexPos });
    }

    return results;
}

async function optimiseCoords (coordsArray) {
    if(coordsArray.length !== 3) {
        coordsArray = coordsArray[0];
    }

    const result = [ Number(coordsArray[0].toFixed(5)), Number(coordsArray[1].toFixed(5)), Number(coordsArray[2].toFixed(5)) ];

    return result;
}

//===============
// Create Window
//===============

async function openWindow () {
    win = new electron.BrowserWindow({
        show: false,
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, '../../interface/Position-World-Map/preload.js')
        }
    });

    
    win.loadFile(path.join(__dirname, '../../interface/Position-World-Map/index.html'));
    win.webContents.on('ipc-message', require('./world-map-window').onWindowMessage);

    win.once('ready-to-show', () => {
        win.show()
    });

    await init();
}

exports.openMapWindow = openWindow;
exports.getMapSection = getMapSection;
exports.pathByIndex = findFilePathByIndex;
exports.getSectionLength = getSectionLength;