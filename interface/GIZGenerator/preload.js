const { contextBridge, ipcRenderer } = require('electron');

//================
// Request system
//================

let lastReqId = 0;
const reqs = {};

function askNode(msgid, ...args) {
    return new Promise(resolve => {
        lastReqId++;

        reqs[lastReqId] = resolve;

        ipcRenderer.send('giz_generator_' + msgid, lastReqId, ...args);
    });
}

ipcRenderer.on('giz_generator_reply', (ev, reqid, reqresult) => {
    let r = reqs[reqid];

    if(!r) {
        console.log('Req not found.');
        return;
    }

    r(reqresult);
    delete reqs[reqid];
});

//===============
// Generator API
//===============

contextBridge.exposeInMainWorld('generatorAPI', {
    getObjectStructure: () =>
        askNode('get-object-structure'),

    getModName: () => 
        askNode('get-mod-name'),

    applyEdits: () =>
        askNode('apply-edits'),

    updateMain: (data, index, checkPaths) =>
        askNode('update-main', data, index, checkPaths),

    addMain: (data, checkPaths) =>
        askNode('add-main', data, checkPaths),

    deleteMain: (index) =>
        askNode('delete-main', index),

    getEditData: (kindOfObject, selectedFileIndex, index) =>
        askNode('get-edit-data', kindOfObject, selectedFileIndex, index),

    editObject: (selectedFileIndex, index, data) =>
        askNode('edit-object', index, selectedFileIndex, data),

    addObject: (selectedFileIndex, data) =>
        askNode('add-object', selectedFileIndex, data),

    deleteObject: (selectedFileIndex, index, kindOfObject) =>
        askNode('delete-object', selectedFileIndex, index, kindOfObject),

    jsonByDialog: () =>
        askNode('json-by-dialog'),

    jsonNewFile: () =>
        askNode('json-new-file')
});