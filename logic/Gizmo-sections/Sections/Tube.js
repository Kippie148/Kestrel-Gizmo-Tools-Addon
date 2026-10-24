const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//=============
// Tube Object
//=============

const TubeObj = [];

//============
// Parse Tube
//============

async function parseTube (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    TubeObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const short1 = buffer.readUInt16LE(pos);
        pos += 2;

        const height = buffer.readFloatLE(pos);
        pos += 4;

        const width = buffer.readFloatLE(pos);
        pos += 4;

        const float3 = buffer.readFloatLE(pos);
        pos += 4;

        const bit0 = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const specialNameLen = buffer.readUInt8(pos);
        pos += 1;

        let specialName = null;

        if(specialNameLen > 0 && specialNameLen < 29) {
            specialName = buffer.subarray(pos, pos + specialNameLen - 1).toString('utf-8');
            pos += specialNameLen;
        }

        const bit2 = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const bit3 = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const bit4 = buffer.readUInt8(pos) !== 0;
        pos += 1;
        
        const bit5 = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const float4 = buffer.readFloatLE(pos);
        pos += 4;

        const bit6 = buffer.readUInt8(pos) & 1;
        pos += 1;

        const short2 = buffer.readInt16LE(pos);
        pos += 2;

        const bit7 = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const bit8 = buffer.readUInt8(pos) & 1;
        pos += 1;

        let actionLength = buffer.readInt16LE(pos);
        if(actionLength < 0) break;
        if(actionLength > 24) actionLength = 24;
        pos += 2;

        const actionBlockName = await readAdd.readNamesFixedBlock(buffer, pos, actionLength, 24, 0);
        pos += actionLength;

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        TubeObj.push({
            actionBlockName: actionBlockName,
            specialName: specialName,
            height: height,
            width: width,
            ending: ending,
            shorts: [ short1, short2 ],
            floats: [ float3, float4 ],
            booleans: [ { label: 'bit0', value: bit0 }, { label: 'bit2', value: bit2 }, { label: 'bit3', value: bit3 }, { label: 'bit4', value: bit4 }, { label: 'bit5', value: bit5 }, { label: 'bit7', value: bit7 }],
            bits: [ bit6, bit8 ]
        });
    }

    // console.log(TubeObj);
    return TubeObj;
}

module.exports = {
    parse: parseTube
}