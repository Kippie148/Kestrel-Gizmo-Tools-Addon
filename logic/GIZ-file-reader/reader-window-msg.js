const reader = require('./main-program');

let events = {};

function handleMsg(channelId, event) {
    events[channelId] = event;
}

//=====================
// File / UI data
//=====================

handleMsg('get-all-headers', () => {
    return reader.getAllHeaders();
});

handleMsg('get-header-name', (_, headerIndex) => {
    return reader.getHeaderName(headerIndex);
});

handleMsg('get-entry-data', (_, headerIndex, entryIndex) => {
    return reader.getEntryData(headerIndex, entryIndex);
});

handleMsg('get-file-ui', () => {
    return reader.getFileUI();
});

//=====================
// File loading
//=====================

handleMsg('load-file-quick-access', (_, name) => {
    if (!reader.loadFileQuickAccess(name)) {
        return false;
    }

    return true;
});

handleMsg('load-file-manually', () => {
    if (!reader.loadFileManually()) {
        return false;
    }

    return true;
});

handleMsg('load-file-main', (_, filePath) => {
    return reader.loadFileMain(filePath);
});

//=====================
// Cache
//=====================

handleMsg('get-main-cache-files', () => {
    reader.loadMainCacheEntries();

    return reader.getMainCacheFiles();
});

//=====================
// Scanning
//=====================

handleMsg('auto-scan', () => {
    if (!reader.autoScan()) {
        return false;
    }

    return true;
});

handleMsg('use-scanner', () => {
    if (!reader.useScanner()) {
        return false;
    }

    return true;
});

//=============
// Message Box
//=============

handleMsg('make-message', (_, title, message, details) => {
    reader.MessageBox(title, message, details);
});

//=================
// Message Control
//=================

/**
 * 
 * @param {Electron.IpcMainEvent} ev
 */
exports.onWindowMessage = async (ev, channelId, reqId, ...args) => {

    if(!channelId.startsWith('giz_reader_')) return;

    channelId = channelId.slice('giz_reader_'.length);

    let e = events[channelId];

    if(e) {

        let v = e(ev, ...args);

        if(v && v.then) v = await v;

        ev.reply('giz_reader_reply', reqId, v == null ? null : v);

    } else {

        console.log('event not declared:', channelId);
        console.log(__filename);
    }

};