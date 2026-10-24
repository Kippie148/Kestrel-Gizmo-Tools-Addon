const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');


//=======================
// Loading for generator
//=======================

async function getLoadPath () {
    const result = await dialog.showOpenDialog({
        title: 'Select a Object.json to load:',
        filters: [{ name: 'JSON', extensions: ['json']}]
    });
    if(result.canceled) {
        console.log('Dialog was canceled.');
        return null;
    }
    if(result.filePaths.length != 1) {
        console.log('Not the right amount of entries selected.')
        return null;
    }

    const filePath = result.filePaths[0];

    return filePath;
}

//================================
// Getting mod path for generator
//================================

async function getJSONModPath () {
    const result = await dialog.showOpenDialog({
        title: 'Select a mod.json to use for object placing:',
        filters: [{ name: 'JSON', extensions: ['json']}]
    });
    if(result.canceled) {
        console.log('Dialog was canceled');
        return null;
    }
    if(result.filePaths.length != 1) {
        console.log('Not the right amount of entries selected.');
        return null;
    }

    const filePath = result.filePaths[0];
    const name = path.basename(filePath);

    if(name !== 'mod.json') {
        console.log('Not a mod selected selected.');
        return null;
    }

    return filePath;
}

//================================
// Getting giz file for inspector
//================================

async function getGizPath () {
    const result = await dialog.showOpenDialog({
        title: 'Select a GIZ file to inspect:',
        filters: [{ name: 'GIZ', extensions: ['GIZ'] }]
    });
    if(result.canceled) {
        console.log('Dialog was canceled.');
        return '';
    }
    if(result.filePaths.length !== 1) {
        return '';
    }

    const filePath = result.filePaths[0];
    
    return filePath;
}

//==========================
// Getting path for scanner
//==========================

async function getPathScanner () {
    const result = await dialog.showOpenDialog({
        title: 'Select a folder to fully scan through:',
        properties: [ 'openDirectory' ]
    });
    if(result.canceled) {
        console.log('Dialog was canceled.');
        return '';
    }
    if(result.filePaths.length !== 1) {
        return '';
    }

    const dirPath = result.filePaths[0];

    return dirPath;
}

module.exports = {
    loadJson: getLoadPath,
    getJSONPath: getJSONModPath,
    gizFilePath: getGizPath,
    scannerPath: getPathScanner
}
