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

        ipcRenderer.send('giz_reader_' + msgid, lastReqId, ...args);
    });
}


ipcRenderer.on('giz_reader_reply', (ev, reqid, reqresult) => {

    let r = reqs[reqid];

    if(!r) {
        console.log('req not found');
        return;
    }

    r(reqresult);
    delete reqs[reqid];

});

//================
// Reader API
//================

contextBridge.exposeInMainWorld('readerAPI', {

    //================
    // GIZ data
    //================

    getAllHeaders: () =>
        askNode('get-all-headers'),

    getHeaderName: (headerIndex) =>
        askNode('get-header-name', headerIndex),

    getEntryData: (headerIndex, entryIndex = null) =>
        askNode('get-entry-data', headerIndex, entryIndex),

    getFileUI: () =>
        askNode('get-file-ui'),

    //================
    // File loading
    //================

    loadFileQuickAccess: (name) =>
        askNode('load-file-quick-access', name),

    loadFileManually: () =>
        askNode('load-file-manually'),

    loadFileMain: (filePath) =>
        askNode('load-file-main', filePath),

    //================
    // Cache
    //================

    getMainCacheFiles: () =>
        askNode('get-main-cache-files'),

    //================
    // Scanner
    //================

    autoScan: () =>
        askNode('auto-scan'),

    useScanner: () =>
        askNode('use-scanner'),

    makeMessage: (title, message, details) =>
        askNode('make-message', title, message, details),

    //================
    // UI updates
    //================

    onUiUpdate: (callback) => {
        ipcRenderer.on('giz_reader_ui-update', event => {
            callback();
        });
    },

    onModalUI: (callback) => {
        ipcRenderer.on('giz_reader_modal-update', () => callback());
    }
});