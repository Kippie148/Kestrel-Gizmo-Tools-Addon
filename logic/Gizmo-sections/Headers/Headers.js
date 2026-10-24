const fs = require('fs').promises

//========
// Object
//========

const shortHeaderInfo = [];
const longHeaderInfo = [];

const headersOb = {
    short: shortHeaderInfo,
    long: longHeaderInfo
};

//========================
// General header parsing
//========================

async function parseHeaders (filePath) {
    try {
        const buffer = await fs.readFile(filePath);
        let pos = 8;

        shortHeaderInfo.length = 0;
        longHeaderInfo.length = 0;

        while(pos < buffer.length) {
            const nameLen = buffer.readUInt32LE(pos);
            if(nameLen <= 0 || nameLen > 19) break;
            pos += 4;

            const name = buffer.subarray(pos, pos + nameLen).toString('utf-8');
            pos += nameLen;

            const blockLength = buffer.readUInt32LE(pos);
            pos += 4;

            if(name === 'GIZSIMPLEPROPOBJECT' || name === 'GizObstacle' || name === 'GizSpellIt' || name === 'GizHint' || name === 'GizDig') {
                const version = buffer.readUInt8(pos);
                pos += 1;

                const entries = buffer.readUInt16LE(pos);
                pos += 2;

                shortHeaderInfo.push({
                    name: name,
                    blockLength: blockLength,
                    version: version,
                    entryCount: entries,
                    offset: pos
                });

                pos += blockLength - 3;
            } else {
                const version = buffer.readUInt32LE(pos);
                pos += 4;

                const entries = buffer.readUInt32LE(pos);
                pos += 4;

                longHeaderInfo.push({
                    name: name,
                    blockLength: blockLength,
                    version: version,
                    entryCount: entries,
                    offset: pos
                });

                pos += blockLength - 8;
            }
        }

        if(buffer.length > pos + 14) {
            longHeaderInfo.push({
                name: 'RegularObjects',
                blockLength: null,
                version: null,
                entryCount: null,
                offset: pos
            });
        }

        // console.log(headersOb.short, '\n', headersOb.long);
        return headersOb;
    } catch (err) {
        console.log('Because of a technical issue headers could not be (completely) parsed.\n', err);
        return null;
    }
}

module.exports = {
    parse: parseHeaders
}