const electron = require('electron');
const path = require('path');
const fs = require('fs');
const dialog = require('../Shared-Logic/electron-dialog');
const JSONHelper = require('../Shared-Logic/JSON-utilities');
const globalVars = require('../../../../global-variables');

const gizmoTemplates = path.join(__dirname, 'gizmo-templates.json');
const backupPath = path.join(__dirname, '../../', 'backups');

let templates = {}

let version = 1;

const newObjects = {};

let loadedModPath;
let loadedModName;
let loadedModData;

let win;

//======
// Init
//======
async function init () {
    if(!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath);
    }

    templates = await JSONHelper.io.load(gizmoTemplates, {});
}

//==========
// Get Data
//==========

function getObjectStructureData () {
    return loadedModData.otherObjects;
}

function getModName () {
    return loadedModName;
}

//===========
// Save File
//===========

async function applyEdits () {
    try {
        if(!await JSONHelper.io.write(loadedModPath, loadedModData)) {
            const messageBoxContent = {
                type: 'error',
                buttons: [ 'ok' ],
                title: 'Error While Saving',
                detail: 'A error occured while trying to save the json file.\nWatch out for corruption and try again or load the backup made after loading this file.\n Backups can be found in: "addons/Gizmo-Tools/backups" folder.'
            };

            showMessage(messageBoxContent, 'See log below.');
            
            return false;
        }

        const messageBoxContent = {
            type: 'info',
            buttons: [ 'ok' ],
            title: 'Save Successfull',
            detail: `The json is successfully written to:\n${loadedModPath}`
        };

        showMessage(messageBoxContent, 'Json successfully saved.');

        return true;
    } catch (err) {
        console.log('Something went wrong while saving the json file.');
        return false;
    }
}

//==========================
// Main information editing
//==========================

async function updateMainInfo (data, index, checkPath) {
    try {
        if(checkPath) {
            if(!checkPaths(data.path, data.imports)) {
                return false;
            }
        }

        const info = loadedModData.otherObjects;

        info[index].path = data.path;

        if(data.com !== '') {
            info[index].com = data.com;
        }

        info[index].imports = data.imports;
        
        return true;
    } catch (err) {
        console.log('Updating main info went wrong.\n', err);
        return false;
    }
}

async function addMainInfo (data, checkPath) {
    try {
        if(checkPath) {
            if(!checkPaths(data.path, data.imports)) {
                return false;
            }
        }

        loadedModData.otherObjects.push(data);

        return true;
    } catch (err) {
        console.log('Adding main info went wrong.\n', err);
        return false;
    }
}

async function deleteMainInfo (index) {
    try {
        loadedModData.otherObjects.splice(index, 1);

        return true;
    } catch (err) {
        console.log('Deleting main info went wrong.\n', err);
        return false;
    }
}

function checkPaths (gizPath, builders) {
    const mainGizPath = path.join(globalVars.KFFolderPath, '../');
    const builderPath = path.join(globalVars.KFFolderPath, '../', 'LEVELS/BUILDER');

    if(!fs.existsSync(path.join(mainGizPath, gizPath))) {
        const messageBoxContent = {
            type: 'warning',
            buttons: [ 'ok' ],
            title: 'Invalid Path',
            detail: `This is not a valid .giz path. Check that it actually exists!\n${path.join(mainGizPath, gizPath)}`
        };
        showMessage(messageBoxContent, `This .giz path is invalid, make sure it exists:\n${path.join(mainGizPath, gizPath)}`);
        return false;
    }

    const badBuilders = [];
    let hasProblems = false;

    builders.forEach(builder => {
        if(!fs.existsSync(path.join(builderPath, builder))) {
            badBuilders.push(builder);
            hasProblems = true;
        }
    });

    if(hasProblems) {
        const messageBoxContent = {
            type: 'warning',
            buttons: [ 'ok' ],
            title: 'Bad Builders Found',
            detail: `Bad imports have been found. Make sure that the files do exist!\n${badBuilders}`
        };
        showMessage(messageBoxContent, `Bad imports have been found, make sure that the files do exist!\nThese broke: ${badBuilders}`);
        return false;
    }

    return true;
}

//================
// Adding Objects
//================

async function getEditData (isNewObjects, selectedFileIndex, index) {
    try {
        if(isNewObjects) {
            return loadedModData.otherObjects[selectedFileIndex].newObjects[index];
        } else {
            return loadedModData.otherObjects[selectedFileIndex].newCoins[index];
        }
    } catch (err) {
        console.log('Could not get the edit data.\n', err);
        return null;
    }
}

async function editObject(selectedFileIndex, index, data) {
    try {
        if(version === 1) {
            await editObjectV1(selectedFileIndex, index, data);
        } else {
            // await editObjectV2(index, data);
        }

        return true;
    } catch (err) {
        console.log('Could not edit this object.\n', err);
        return false;
    }
}

async function editObjectV1 (selectedFileIndex, index, data) {
    if(data.formType === 'newObjects') {
        const entry = loadedModData.otherObjects[selectedFileIndex].newObjects[index];

        entry.type = data.type;
        entry.name = data.name;
        entry.class = data.class;
        entry.pos = data.pos;
        if(Object.hasOwn(data, 'rotY') && data.rotY !== 0) {
            entry.rotY = data.rotY;
        }
        if(Object.hasOwn(data, 'rotX') && data.rotX !== 0) {
            entry.rotX = data.rotX;
        }
        if(Object.hasOwn(data, 'endline') && data.endline !== '') {
            entry.endline = data.endline;
        }
    } else {
        const entry = loadedModData.otherObjects[selectedFileIndex].newCoins[index];

        entry.type = data.type;
        entry.name = data.name;
        entry.pos = data.pos;
    }
}

// async function editObjectV2 (index, data) {

// }

async function addObject (selectedFileIndex, data) {
    try {
        if(version === 1) {
            await addObjectV1(selectedFileIndex, data);
        } else {
            // await addObjectV2(data);
        }

        return true;
    } catch (err) {
        console.log('Could not add this object.\n', err);
        return false;
    }
    
}

async function addObjectV1 (selectedFileIndex, data) {
    if(data.formType === 'newObjects') {
        if(!Object.hasOwn(loadedModData.otherObjects[selectedFileIndex], 'newObjects')) {
            loadedModData.otherObjects[selectedFileIndex].newObjects = [];
        }
        delete data.formType;
        loadedModData.otherObjects[selectedFileIndex].newObjects.push(data);
    } else {
        if(!Object.hasOwn(loadedModData.otherObjects[selectedFileIndex], 'newCoins')) {
            loadedModData.otherObjects[selectedFileIndex].newCoins = [];
        }
        delete data.formType;
        loadedModData.otherObjects[selectedFileIndex].newCoins.push(data);
    }
}

// async function addObjectV2 (data) {

// }

async function deleteObject (selectedFileIndex, index, kindOfObject) {
    try {
        if(version === 1) {
            loadedModData.otherObjects[selectedFileIndex][kindOfObject].splice(index, 1);
        } else {
            // map manager 2.0 logic
        }

        return true;
    } catch (err) {
        console.log('Could not remove this object.\n', err);
        return false;
    }
}

//================
// Getting JSON's
//================

async function getJSONByDialog () {
    try {
        const result = await dialog.loadJson();
        if(!result) {
            return false;
        }

        loadedModPath = result;
        loadedModName = path.basename(path.join(result, '../../'));
        loadedModData = await JSONHelper.io.load(result);

        if(!await createBackup()) {
            return false;
        }

        return true;
    } catch (err) {
        console.log('Getting the Json went wrong.\n', err);
        return false;
    }
}

async function getModJSONForNewFile () {
    try {
        const MessageBoxTemplate = {
            type: 'question',
            buttons: [ 'no', 'yes' ],
            title: 'Mod already contains objects.',
            detail: 'This mod already loads objects. Do you want to overwrite it the json and create a new one?'
        };

        const result = await dialog.getJSONPath();
        if(!result) {
            return false;
        }

        const modObjectFolderPath = path.join(result, '../', 'map');
        const modObjectPath = path.join(modObjectFolderPath, 'Objects.json');

        if(!fs.existsSync(modObjectFolderPath)) {
            if(fs.mkdirSync(modObjectFolderPath)) {
                console.log('Creating the map folder failed.');
                return false;
            }
        }

        if(fs.existsSync(modObjectPath)) {
            if(!showMessage(MessageBoxTemplate, [ 'Overwriting...', 'Overwriting aborted.' ])) return true;
            if(!fs.rmSync(modObjectFolderPath)) {
                console.log('The Objects.json could not be deleted.');
                return false;
            }
            if(!await JSONHelper.io.write(modObjectPath, { otherObjects: [] })) {
                return false;
            }
                
            return true;
        } else {
            if(fs.writeFileSync(modObjectPath, '')) {
                return false;
            }
        }

        if(!await JSONHelper.feature.updateJson(result, 'map')) {
            console.log('Patching mod.json went wrong.');
            return false;
        }

        if(!await JSONHelper.io.write(modObjectPath, { otherObjects: [] })) {
            console.log('Json file could not be written.');
            return false;
        }

        loadedModPath = modObjectPath;
        loadedModName = path.basename(path.join(modObjectPath, '../../'));
        loadedModData = await JSONHelper.io.load(modObjectPath);

        if(!await createBackup()) {
            console.log('Creating backup went wrong.');
            return false;
        }

        return true;
    } catch(err) {
        console.log('Making a new file and updating JSON failed.\n', err);
        return false;
    }
}

//==================
// Backup Functions
//==================

async function createBackup () {
    const specificBackupFolderPath = path.join(backupPath, loadedModName);
    const specificBackupFilePath = path.join(specificBackupFolderPath, 'Objects.json');

    if(!fs.existsSync(specificBackupFolderPath)) {
        if(!fs.mkdirSync(specificBackupFolderPath)) {
            return false;
        }
    }

    if(!fs.copyFileSync(loadedModPath, specificBackupFilePath)) {
        return false;
    }

    return true;
}

//=======================
// JSON Structure Legacy
//=======================

// Program expects the Objects.json to have otherObjects already written.

// JSON structure
// {
//     "otherObjects": [
//         {
//             "path": 'string',

//             "com": 'string',

//             "imports": [ 'string' ],

//             "objectNames": [ 'string' ],

//             "newObjects": [

//                 {
//                     "type": 'string'(id for my code),

//                     "name": 'string',

//                     "pos": [ 'float', 'float', 'float' ],

//                     "rotY": 'int',
//                     "rotX": 'int'
                    
//                 },

//                 {
//                     "type": 'string'(id for my code),

//                     "name": 'string',

//                     "class": 'string',

//                     "pos": [ 'float', 'float', 'float' ],

//                     "rotY": 'int',
//                     "rotX": 'int',

//                     "endline": 'hex'
//                 }
//             ],

//             "newCoins": [
//                 {
//                     "type": 'identifier (numbers or string)',

//                     "name": 'string',

//                     "pos": [ 'float'. 'float', 'float' ]
//                 }
//             ],
//
//             "removeCoins": [
//                 "name": 'string'
//             ]
//         }
//     ]
// }

//==================
// Window functions
//==================

async function openWindow() {
    win = new electron.BrowserWindow({
        show: false,
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, '../../interface/GIZGenerator/preload.js')
        }
    });

    win.once('ready-to-show', () => win.show());
    win.loadFile(path.join(__dirname, '../../interface/GIZGenerator/index.html'));
    win.webContents.on('ipc-message', require('./generator-window-msg').onWindowMessage);

    await init();
}

function showMessage (message, logMessages) {
    const succes = electron.dialog.showMessageBoxSync(win, message);

    if(succes === 1) {
        console.log(logMessages[0]);
        return true;
    } else {
        console.log(logMessages[1]);
        return false;
    }
}

exports.openGizGeneratorWindow = openWindow;
exports.getObjectStructureData = getObjectStructureData;
exports.getModName = getModName;
exports.applyEdits = applyEdits;
exports.updateMainInfo = updateMainInfo;
exports.addMainInfo = addMainInfo;
exports.deleteMainInfo = deleteMainInfo;
exports.getEditData = getEditData;
exports.editObject = editObject;
exports.addObject = addObject;
exports.deleteObject = deleteObject;
exports.getJSONByDialog = getJSONByDialog;
exports.getJsonNewFile = getModJSONForNewFile;