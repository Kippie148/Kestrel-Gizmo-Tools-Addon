const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//=============
// Pole Object
//=============

const PoleObj = [];

//============
// Parse Pole
//============

async function parsePole (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    PoleObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const Ushort = buffer.readUInt16LE(pos);
        pos += 2;

        const height = buffer.readFloatLE(pos);
        pos += 4;

        const width = buffer.readFloatLE(pos);
        pos += 4;

        const float3 = buffer.readFloatLE(pos);
        pos += 4;

        const char1 = buffer.readInt8(pos);
        pos += 1;

        const blockLength = buffer.readUInt8(pos);
        pos += 1;
        if(blockLength > 40) break;

        let specialName = null;

        if(blockLength !== 0) {
            specialName = await readAdd.readNamesFixedBlock(buffer, pos, blockLength, 0);
            pos += blockLength;
        }

        const char2 = buffer.readInt8(pos);
        pos += 1;

        const float4 = buffer.readFloatLE(pos);
        pos += 4;

        const float5 = buffer.readFloatLE(pos);
        pos += 4;

        const float6 = buffer.readFloatLE(pos);
        pos += 4;

        let char3 = null;
        if(version > 1) {
            char3 = buffer.readInt8(pos);
            pos += 1;
        }

        let Uint = null;
        let float7 = null;
        let float8 = null;

        if(version > 2) {
            Uint = buffer.readUInt32LE(pos);
            pos += 4;

            float7 = buffer.readFloatLE(pos);
            pos += 4;

            float8 = buffer.readFloatLE(pos);
            pos += 4;
        }

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        PoleObj.push({
            specialName: specialName,
            height: height,
            width: width,
            ending: ending,
            Ushort: Ushort,
            Uint: Uint,
            chars: [ char1, char2, char3 ],
            floats: [ float3, float4, float5, float6, float7 ]
        });
    }

    // console.log(PoleObj);
    return PoleObj;
}

module.exports = {
    parse: parsePole
}