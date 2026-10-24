const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//================
// GizHint Object
//================

const GizHintObj = [];

//===============
// Parse GizHint
//===============

async function parseGizHint (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    GizHintObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const int1 = buffer.readInt32LE(pos);
        pos += 4;

        const NuVec1 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

        const NuVec2 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const float3 = buffer.readFloatLE(pos);
        pos += 4;

        let specialName = null;
        let someName1 = null;
        let someName2 = null;

        const specialNameLen = buffer.readUInt8(pos);
        pos += 1;

        if(specialNameLen > 0 && specialNameLen < 40) {
            specialName = buffer.subarray(pos, pos + specialNameLen - 1).toString('utf-8');
            pos += specialNameLen;
        }

        const someNameLen1 = buffer.readUInt8(pos);
        pos += 1;

        if(someNameLen1 > 0 && someNameLen1 < 40) {
            someName1 = buffer.subarray(pos, pos + someNameLen1 - 1).toString('utf-8');
            pos += someNameLen1;
        }

        const someNameLen2 = buffer.readUInt8(pos);
        pos += 1;

        if(someNameLen2 > 0 && someNameLen2 < 40) {
            someName2 = buffer.subarray(pos, pos + someNameLen2 - 1).toString('utf-8');
            pos += someNameLen2;
        }

        const hintNameLen = buffer.readUInt8(pos);
        if(hintNameLen > 40) break;
        pos += 1;

        const hintName = buffer.subarray(pos, pos + hintNameLen - 1).toString('utf-8');
        pos += hintNameLen;

        const bit3 = buffer.readInt32LE(pos) & 1;
        pos += 4;

        const bit1 = buffer.readInt32LE(pos) & 1;
        pos += 4;

        const bit2 = buffer.readInt32LE(pos) & 1;
        pos += 4;

        const int2 = buffer.readInt32LE(pos);
        pos += 4;

        const Uint = buffer.readUInt32LE(pos);
        pos += 4;

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        GizHintObj.push({
            hintName: hintName,
            NuVecs: [ NuVec1, NuVec2 ],
            specialName: specialName,
            extraNames: [ someName1, someName2 ],
            ending: ending,
            uint: Uint,
            ints: [ int1, int2 ],
            floats: [ float1, float2, float3 ],
            bits: [ bit3, bit1, bit2 ]
        });
    }

    // console.log(GizHintObj);
    return GizHintObj;
}

module.exports = {
    parse: parseGizHint
}