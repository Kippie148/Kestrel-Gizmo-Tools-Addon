const fs = require('fs');
const path = require('path');
const electron = require('electron');

const globalVars = require('../../../../global-variables');

const cache = require('./../Shared-Logic/cache-manager');
const parser = require('../Shared-Logic/giz-parser');
const dialog = require('../Shared-Logic/electron-dialog');
const scanner = require('../Shared-Logic/file-path-scanner');

require('../Shared-Logic/JSON-utilities');


//================
// State
//================

let win = null;

let gizParseData = null;
let allHeaders = null;

let fileUI = [];

let mainCacheEntries = null;
let recentFilesData = [];


//================
// Initialisation
//================

function checkCacheIssue() {
    return cache.init.check();
}

async function init() {
    try {
        if (!checkCacheIssue()) {
            return false;
        }

        const recentData = await cache.recent.get();

        recentFilesData = recentData.recent ?? [];
        fileUI = setFileUIFormat(recentFilesData);

        let firstLoad;

        if (
            recentFilesData.length > 0 &&
            recentFilesData[0]?.path
        ) {
            firstLoad = recentFilesData[0].path;
        } else {
            firstLoad = path.join(globalVars.KFFolderPath, '..', 'LEVELS', 'STANDALONES', 'ROOFTOPS', 'SF_ROOFTOP.GIZ');
        }

        await loadNewGizFile(firstLoad);

        sendUiUpdate();

        return true;

    } catch (err) {
        console.error('Init failed.', err);
        return false;
    }
}


//===================
// UI data
//===================

function getAllHeaders() {
    return allHeaders;
}


function getHeaderName(headerIndex) {
    return allHeaders[headerIndex]?.name ?? null;
}


function getEntryData(headerIndex, entryIndex = null) {
    try {
        let entries;

        if(getHeaderName(headerIndex) === 'GizmoPickup') {
            entries = [gizParseData.entries[headerIndex].header, ...gizParseData.entries[headerIndex].entries]
        } else {
            entries = gizParseData?.entries?.[headerIndex];
        }

        if (!entries) {
            return entryIndex === null ? [] : null;
        }

        if (entryIndex === null) {
            return entries;
        }

        return entries[entryIndex] ?? null;
    } catch (err) {
        console.log(`Getting the entry data went wrong.\n${err}`);
        return null;
    }
}


function getFileUI() {
    return fileUI;
}


function getMainCacheFiles() {
    return mainCacheEntries;
}


function setFileUIFormat(data) {
    return data.map(item => item.name);
}


function loadMainCacheEntries() {
    mainCacheEntries = cache.main.get();

    return mainCacheEntries;
}


//=========================
// File loading
//=========================

async function loadFileManually() {
    try {
        const result = await dialog.gizFilePath();

        if (!result) {
            return false;
        }

        await loadNewGizFile(result);

        if (!await cache.recent.add(result)) {
            return false;
        }

        if (!await cache.main.add(result)) {
            return false;
        }

        await refreshRecentFiles();

        sendUiUpdate();

        return true;

    } catch (err) {
        console.error('Loading file manually failed.', err);
        return false;
    }
}

async function loadFileQuickAccess(selectedName) {
    try {
        const found = findRecentObject(selectedName);

        if (!found?.path) {
            console.error(`Quick access file not found: ${selectedName}`);
            return false;
        }

        await loadNewGizFile(found.path);

        if (!await cache.recent.add(found.path)) {
            return false;
        }

        await refreshRecentFiles();

        sendUiUpdate();

        return true;

    } catch (err) {
        console.error('Quick access load went wrong.', err);
        return false;
    }
}


async function loadFileMain(filePath) {
    try {
        if (!filePath) {
            return false;
        }

        await loadNewGizFile(filePath);

        if (!await cache.recent.add(filePath)) {
            return false;
        }

        await refreshRecentFiles();

        sendUiUpdate();

        return true;

    } catch (err) {
        console.error('Loading file from main went wrong.', err);
        return false;
    }
}


function findRecentObject(selectedName) {
    return recentFilesData.find(
        item => item.name === selectedName
    );
}


async function refreshRecentFiles() {
    const data = await cache.recent.get();

    recentFilesData = data.recent ?? [];
    fileUI = setFileUIFormat(recentFilesData);
}


//=========
// Scanner
//=========

async function autoScan() {
    try {
        const scanPathCity = path.join(globalVars.KFFolderPath, '..', 'LEVELS', 'LEGO_CITY');

        const scanPathStandalones = path.join(globalVars.KFFolderPath, '..', 'LEVELS', 'STANDALONES');

        if (!fs.existsSync(scanPathCity) || !fs.existsSync(scanPathStandalones)) {
            console.error('Preset paths do not work.');
            return false;
        }

        const resultCity = await scanner.scanGizDir(scanPathCity);

        const resultStandalone = await scanner.scanGizDir(scanPathStandalones);

        if (!await cache.main.bulk(resultCity)) {
            console.error('Autoscanner failed while writing city files.');
            return false;
        }

        if (!await cache.main.bulk(resultStandalone)) {
            console.error('Autoscanner failed while writing standalone files.');
            return false;
        }

        sendModalUI();

        return true;

    } catch (err) {
        console.error('Something went wrong while auto scanning for GIZ files.', err);
        return false;
    }
}


async function useScanner() {
    try {
        const scannerPath = await dialog.scannerPath();

        if (!scannerPath || !fs.existsSync(scannerPath)) {
            console.error('Something went wrong when gathering the scanner path.');
            return false;
        }

        const result = await scanner.scanGizDir(scannerPath);
        
        if (!await cache.main.bulk(filteredResult)) {
            console.error('Scanner failed while writing results.');
            return false;
        }

        sendModalUI();

        return true;

    } catch (err) {
        console.error('Something failed during the scan process.', err);
        return false;
    }
}


//===============
// GIZ loading
//===============

async function loadNewGizFile(targetPath) {
    const data = await parser.parseGiz(targetPath);

    gizParseData = data;
    allHeaders = [...data.headers.short, ...data.headers.long];
}

//================
// UI events
//================

function sendUiUpdate() {
    win.webContents.send('giz_reader_ui-update');
}

function sendModalUI() {
    win.webContents.send('giz_reader_modal-update');
}


//================
// Open window
//================

function openWindow() {
    win = new electron.BrowserWindow({
        show: false,
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, '../../interface/GIZFileReader/preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.once('ready-to-show', () => {
        win.show();
    });

    win.loadFile(path.join(__dirname, '../../interface/GIZFileReader/index.html'));

    win.webContents.on('ipc-message', require('./reader-window-msg').onWindowMessage);

    win.on('closed', () => {
        win = null;
    });

    init().then(success => {
        if (!success) {
            console.error('Reader initialization failed.');
        }
    });
}

function spawnMessageBox (title, message, details) {
    const messageTemplate = {
        type: 'info',
        title: title,
        message: message,
        detail: details,
        buttons: ['Ok']
    };

    electron.dialog.showMessageBox(win, messageTemplate);
}


//================
// Exports
//================

exports.openReaderWindow = openWindow;
exports.MessageBox = spawnMessageBox;
exports.getAllHeaders = getAllHeaders;
exports.getHeaderName = getHeaderName;
exports.getEntryData = getEntryData;
exports.getFileUI = getFileUI;
exports.loadFileQuickAccess = loadFileQuickAccess;
exports.loadFileManually = loadFileManually;
exports.loadFileMain = loadFileMain;
exports.loadMainCacheEntries = loadMainCacheEntries;
exports.getMainCacheFiles = getMainCacheFiles;
exports.autoScan = autoScan;
exports.useScanner = useScanner;