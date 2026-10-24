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

        ipcRenderer.send('giz_map_' + msgid, lastReqId, ...args);
    });
}


ipcRenderer.on('giz_map_reply', (ev, reqid, reqresult) => {

    let r = reqs[reqid];

    if(!r) {
        console.log('req not found');
        return;
    }

    r(reqresult);
    delete reqs[reqid];

});

//================
// Map API
//================

contextBridge.exposeInMainWorld('mapAPI', {

    getEntries: (headerName, key) =>
        askNode('get-entries', headerName, key),
    
    pathByIndex: (index) =>
        askNode('get-path-index', index),

    getSectionLength: (headerName) =>
        askNode('get-section-length', headerName)

});