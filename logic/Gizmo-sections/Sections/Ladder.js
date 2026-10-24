const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//===============
// Ladder Object
//===============

const ladderObj = [];

//==============
// Parse Ladder
//==============

async function parseLadder (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    ladderObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const type = await readAdd.readNamesFixedBlock(buffer, pos, 16, 15, 0, 1);
        pos += 16;

        const RotY = buffer.readUInt16LE(pos);
        pos += 2;

        const height = buffer.readUInt8(pos);
        pos += 1;

        const char2 = buffer.readUInt8(pos);
        pos += 1;

        const char3 = buffer.readUInt8(pos);
        pos += 1;

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        ladderObj.push({
            type: type,
            ending: ending,
            rotationY: RotY,
            height: height,
            chars: [ char2, char3 ]
        });
    }

    // console.log(ladderObj);
    return ladderObj;
}

module.exports = {
    parse: parseLadder
}