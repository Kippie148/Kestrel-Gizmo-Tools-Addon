const map = require('./main-program');

let events = {};

function handleMsg(channelId, event) {
    events[channelId] = event;
}

//===================
// Renderer Requests
//===================

handleMsg('get-entries', (_, headerName, key) => {
    return map.getMapSection(headerName, key);
});

handleMsg('get-path-index', (_, index) => {
    return map.pathByIndex(index);
});

handleMsg('get-section-length', (_, headerName) => {
    return map.getSectionLength(headerName);
})

//=================
// Message Control
//=================

/**
 * 
 * @param {Electron.IpcMainEvent} ev
 */
exports.onWindowMessage = async (ev, channelId, reqId, ...args) => {

    if(!channelId.startsWith('giz_map_')) return;

    channelId = channelId.slice('giz_map_'.length);

    let e = events[channelId];

    if(e) {

        let v = e(ev, ...args);

        if(v && v.then) v = await v;

        ev.reply('giz_map_reply', reqId, v == null ? null : v);

    } else {

        console.log('event not declared:', channelId);
        console.log(__filename);
    }

};