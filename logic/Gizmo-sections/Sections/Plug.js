const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//=============
// Plug Object
//=============

const plugObj = [];

//============
// Parse Plug
//============

async function parsePlug (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    plugObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const Ushort1 = buffer.readUInt16LE(pos);
        pos += 2;

        const Ushort2 = buffer.readUInt16LE(pos);
        pos += 2;

        const Ushort3 = buffer.readUInt16LE(pos);
        pos += 2;

        const Ushort4 = buffer.readUInt16LE(pos);
        pos += 2;

        const bitFlags = buffer.readUInt16LE(pos);
        pos += 2;

        const bits0to2 = (bitFlags & 0b111).toString(2).padStart(3, '0');
        
        const nameCheck = ((bitFlags >> 3) & 0b11) === 0b11;

        const bits5to10 = ((bitFlags >> 5) & 0b111111).toString(2).padStart(6, '0');

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const float3 = buffer.readFloatLE(pos);
        pos += 4;

        let itemTypeSysName = null;

        if(nameCheck) {
            const nameLen = buffer.readUInt8(pos);
            if(nameLen > 40) break;
            pos += 1;

            itemTypeSysName = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
            pos += nameLen;
        }

        const Uchar = buffer.readUInt8(pos);
        pos += 1;

        let Uint = null;

        if(version !== 17) {
            Uint = buffer.readUInt32LE(pos);
            pos += 4;
        }

        const animSet = await readAdd.readGameAnimSet(buffer, pos);
        pos = animSet.offset;

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        plugObj.push({
            animSet: animSet.animations,
            itemName: itemTypeSysName,
            ending: ending,
            Uchar: Uchar,
            Uint: Uint,
            float: [ float1, float2, float3 ],
            Ushorts: [ Ushort1, Ushort2, Ushort3, Ushort4 ],
            bits: [ bits0to2, bits5to10 ]
        });
    }

    // console.log(plugObj);
    return plugObj;
}

module.exports = {
    parse: parsePlug
}