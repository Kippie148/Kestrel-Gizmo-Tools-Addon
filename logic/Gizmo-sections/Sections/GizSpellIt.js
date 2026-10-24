const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//===================
// GizSpellIt Object
//===================

const GizSpellItObj = [];

//==================
// Parse GizSpellIt
//==================

async function parseGizSpellIt (filePath, headerEntry) {
    const buffer  = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    GizSpellItObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const NuVec1 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const NuVec2 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const NuVec3 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const NuVec4 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const rawData = await readAdd.readGameAnimSet(buffer, pos, false);
        pos = rawData.offset;
        const animSet = rawData.animations;

        const short1 = buffer.readInt16LE(pos);
        pos += 2;

        const char1 = buffer.readInt8(pos);
        pos += 1;

        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const float3 = buffer.readFloatLE(pos);
        pos += 4;

        const float4 = buffer.readFloatLE(pos);
        pos += 4;

        const float5 = buffer.readFloatLE(pos);
        pos += 4;

        const float6 = buffer.readFloatLE(pos);
        pos += 4;

        const float7 = buffer.readFloatLE(pos);
        pos += 4;

        const float8 = buffer.readFloatLE(pos);
        pos += 4;

        const specialNameLength = buffer.readUInt8(pos);
        pos += 1;

        // let specialname;

        // if(specialNameLength > 0 && specialNameLength < 32) {
        //     console.log('Some special name collected.');
        //     specialName = await readAdd.readNamesFixedBlock(buffer, pos, specialNameLength, 30, 0);
        //     pos += specialNameLength;
        // }
        // Unused

        const short2 = buffer.readInt16LE(pos);
        pos += 2;

        const short3 = buffer.readInt16LE(pos);
        pos += 2;

        const NuVec5 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const float9 = buffer.readFloatLE(pos);
        pos += 4;

        const Uint1 = buffer.readUInt32LE(pos);
        pos += 4;

        const Uint2 = buffer.readUInt32LE(pos);
        pos += 4;

        const char2 = buffer.readInt8(pos);
        pos += 1;

        const short4 = buffer.readInt16LE(pos);
        pos += 2;

        const someLength = buffer.readInt8(pos);
        pos += 1;

        // let someName = null;

        // if(someLength > 0 && someLength < 32) {
        //     console.log('Some name collected.');
        //     someName = await readAdd.readNamesFixedBlock(buffer, pos, 32, 32, 0);
        //     pos += 32;
        // }
        // Unused

        const float10 = buffer.readFloatLE(pos);
        pos += 4;

        const float11 = buffer.readFloatLE(pos);
        pos += 4;

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        GizSpellItObj.push({
            NuVecs: [ NuVec1, NuVec2, NuVec3, NuVec4, NuVec5 ],
            // specialName: specialName,
            animSet: animSet,
            // someName: someName,
            ending: ending,
            uints: [ Uint1, Uint2 ],
            chars: [ char1, char2 ],
            shorts: [ short1, short2, short3 ],
            floats: [ float2, float3, float4, float5, float6, float7, float8, float9, float9, float10, float11 ]
        });
    }

    // console.log(GizSpellItObj);
    return GizSpellItObj;
}

module.exports = {
    parse: parseGizSpellIt
}