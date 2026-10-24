const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//=============
// Door object
//=============

const DoorObj = [];

//=============
// Door parser
//=============

async function parseDoor (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    DoorObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const arrayObj = [];

        let nullPos;

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const float3 = buffer.readFloatLE(pos)
        pos += 4;

        const char1 = buffer.readInt8(pos);
        pos += 1;

        const short1 = buffer.readInt16LE(pos);
        pos += 2;

        const short2 = buffer.readInt16LE(pos);
        pos += 2;

        const arrayCount = buffer.readUInt32LE(pos);
        pos += 4;

        if(arrayCount > 8) { console.log(DoorObj, pos, DoorObj.specialStrings); return DoorObj; }

        for(let j = 0; j < arrayCount; j++) {
            const Short1 = buffer.readInt16LE(pos);
            pos += 2;

            const NuVec = await readAdd.readNuVec(buffer, pos);
            pos += 12;

            const Short2 = buffer.readInt16LE(pos);
            pos += 2;

            arrayObj.push({
                Shorts: [ Short1, Short2 ],
                NuVec: NuVec
            });
        }

        // Hardcoded 32 bytes chunks with target name(s)
        const destNames = await readAdd.readNamesFixedBlock(buffer, pos, 32, 30, 1);
        pos += 32;
        
        const specialString1 = await readAdd.readNamesFixedBlock(buffer, pos, 32, 28, 0);
        pos += 32;

        const specialString2 = await readAdd.readNamesFixedBlock(buffer, pos, 32, 28, 0);
        pos += 32;

        const char2 = buffer.readInt8(pos); // Might be bool
        pos += 1;

        const char3 = buffer.readInt8(pos);
        pos += 1;

        const int32 = buffer.readInt32LE(pos);
        pos += 4;

        const cutName = await readAdd.readNamesFixedBlock(buffer, pos, 32, 28, 0);
        pos += 32;

        const extraNames = buffer.readInt16LE(pos); // -1 results in 0xFFFFFFFFFFFFFFFF Unknown what it does
        pos += 2;

        const extraNameArray = [];

        for(let e = 0; e < extraNames; e++) {
            const extraName = await readAdd.readNamesFixedBlock(buffer, pos, 32, 28, 0);
            pos += 32;

            extraNameArray.push( extraName );
        }

        const NuVec = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const short3 = buffer.readInt16LE(pos);
        pos += 2;

        const short4 = buffer.readInt16LE(pos);
        pos += 2;

        let short5;

        if(version >= 10) {
            short5 = buffer.readInt16LE(pos);
            pos += 2;
        }

        const nameLength = buffer.readUInt8(pos);
        pos += 1;

        let linkedName = null;

        if(nameLength !== 0) {
            linkedName = buffer.subarray(pos, pos + nameLength - 1).toString('utf-8'); // Does not appear so get's skipped in results now.
            pos += nameLength;
        }

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        DoorObj.push({
            dest: destNames[0],
            specialStrings: [ specialString1, specialString2 ],
            cutScene: cutName[0],
            extraNames: extraNameArray,
            ending: ending,
            NuVec: NuVec,
            arrays: arrayObj,
            floats: [ float1, float2, float3 ],
            shorts: [ short1, short2, short3, short4, short5 ],
            chars: [ char1, char2, char3 ],
            int: int32
        });
    }

    // console.log(DoorObj);
    return DoorObj;
}

module.exports = {
    parse: parseDoor
}