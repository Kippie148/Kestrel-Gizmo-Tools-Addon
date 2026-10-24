const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//==================
// LightBeam Object
//==================

const LightBeamObj = [];

//=================
// Parse LightBeam
//=================

async function parseLightBeam (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    LightBeamObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const short1 = buffer.readInt16LE(pos);
        pos += 2;

        const short2 = buffer.readInt16LE(pos);
        pos += 2;

        const short3 = buffer.readInt16LE(pos);
        pos += 2;

        const short4 = buffer.readInt16LE(pos);
        pos += 2;

        const short5 = buffer.readInt16LE(pos);
        pos += 2;

        const short6 = buffer.readInt16LE(pos);
        pos += 2;

        const short7 = buffer.readInt16LE(pos);
        pos += 2;

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const float3 = buffer.readFloatLE(pos);
        pos += 4;

        const float4 = buffer.readFloatLE(pos);
        pos += 4;

        const bits = buffer.readUInt16LE(pos);
        pos += 2;

        const bit0to13 = (bits & 16383).toString(2).padStart(14, '0'); // 0-7, 8, 9, 10, 11, 12, 13

        let Uchar = null;

        if(version > 14) {
            Uchar = buffer.readUInt8(pos);
            pos += 1;
        }

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        LightBeamObj.push({
            ending: ending,
            bits: bit0to13,
            uchar: Uchar,
            floats: [ float1, float2, float3, float4 ],
            shorts: [ short1, short2, short3, short4, short5, short6, short7 ]
        });
    }

    // console.log(LightBeamObj);
    return LightBeamObj;
}

module.exports = {
    parse: parseLightBeam
}