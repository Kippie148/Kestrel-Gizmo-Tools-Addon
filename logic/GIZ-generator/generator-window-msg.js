const generator = require('./main-program');

let events = {};

function handleMsg(channelId, event) {
    events[channelId] = event;
}

//=====================
// Generator Functions
//=====================

handleMsg('get-object-structure', () => {
    return generator.getObjectStructureData();
});

handleMsg('get-mod-name', () => {
    return generator.getModName();
});

handleMsg('apply-edits', () => {
    return generator.applyEdits();
});

handleMsg('update-main', (_, data, index, checkPaths) => {
    return generator.updateMainInfo(data, index, checkPaths);
});

handleMsg('add-main', (_, data, checkPaths) => {
    return generator.addMainInfo(data, checkPaths);
})

handleMsg('delete-main', (_, index) => {
    return generator.deleteMainInfo(index);
});

handleMsg('get-edit-data', (_, kindOfObject, selectedFileIndex, index) => {
    return generator.getEditData(kindOfObject, selectedFileIndex, index);
});

handleMsg('edit-object', (_, selectedFileIndex, index, data) => {
    return generator.editObject(selectedFileIndex, index, data);
});

handleMsg('add-object', (_, selectedFileIndex, data) => {
    return generator.addObject(selectedFileIndex, data);
});

handleMsg('delete-object', (_, selectedFileIndex, index, kindOfObject) => {
    return generator.deleteObject(selectedFileIndex, index, kindOfObject);
});

handleMsg('json-by-dialog', () => {
    return generator.getJSONByDialog();
});

handleMsg('json-new-file', () => {
    return generator.getJsonNewFile();
})

/**
 * @param {Electron.IpcMainEvent} ev
 */

exports.onWindowMessage = async (ev, channelId, reqId, ...args) => {
    if(!channelId.startsWith('giz_generator_')) return;

    channelId = channelId.slice('giz_generator_'.length);

    let e = events[channelId];

    if(e) {
        let v = e(ev, ...args);

        if(v && v.then) v = await v;

        ev.reply('giz_generator_reply', reqId, v == null ? null : v);
    } else {
        console.log('Even not declared: ', channelId);
        console.log(__filename);
    }
}