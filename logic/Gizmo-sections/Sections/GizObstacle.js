const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//====================
// GizObstacle Object
//====================

const GizObstacleObj = [];

//====================
// GizObstacle parser
//====================

async function parseGizObstacle (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    GizObstacleObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        let nameLen;

        const NuVec1 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const NuVec2 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const short1 = buffer.readInt16LE(pos);
        pos += 2;

        const long = buffer.readBigUint64LE(pos);
        pos += 8;

        const int1 = buffer.readInt32LE(pos);
        pos += 4;

        const char1 = buffer.readInt8(pos);
        pos += 1;

        const char2 = buffer.readInt8(pos);
        pos += 1;

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

        const char3 = buffer.readInt8(pos);
        pos += 1;

        let gameAnimSet;
        let result

        result = await readAdd.readGameAnimSet(buffer, pos, true);
        pos = result.offset;
        gameAnimSet = result.animations;

        const float8 = buffer.readFloatLE(pos);
        pos += 4;
        
        const float9 = buffer.readFloatLE(pos);
        pos += 4;

        const float10 = buffer.readFloatLE(pos);
        pos += 4;

        const int2 = buffer.readInt32LE(pos);
        pos += 4;

        const short2 = buffer.readInt16LE(pos);
        pos += 2;

        const short3 = buffer.readInt16LE(pos);
        pos += 2;

        const NuVec3 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const float11 = buffer.readFloatLE(pos);
        pos += 4;

        const short4 = buffer.readInt16LE(pos);
        pos += 2;

        const SoundIdNames = [ null, null ];

        nameLen = buffer.readUInt8(pos);
        if(nameLen > 40) break;
        pos += 1;
        if(nameLen !== 0) {
            const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
            SoundIdNames[0] = name;
            pos += nameLen;
        }

        nameLen = buffer.readUInt8(pos);
        if(nameLen > 40) return GizObstacleObj;
        pos += 1;
        if(nameLen !== 0) {
            const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
            SoundIdNames[1] = name;
            pos += nameLen;
        }

        let someName = null;

        nameLen = buffer.readUInt8(pos);
        if(nameLen > 40) return GizObstacleObj;
        pos += 1;
        if(nameLen !== 0) {
            someName = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
            pos += nameLen;
        }

        const short5 = buffer.readInt16LE(pos);
        pos += 2;

        const short6 = buffer.readInt16LE(pos);
        pos += 2;

        let specialSystemName = null;

        nameLen = buffer.readUInt8(pos);
        if(nameLen > 40) return GizObstacleObj;
        pos += 1;
        if(nameLen !== 0) {
            specialSystemName = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
            pos += nameLen;
        }

        const char4 = buffer.readInt8(pos);
        pos += 1;

        const char5 = buffer.readInt8(pos);
        pos += 1;

        const char6 = buffer.readInt8(pos);
        pos += 1;

        let linkedName = null;

        nameLen = buffer.readUInt8(pos);
        if(nameLen > 40) return GizObstacleObj;
        pos += 1
        if(nameLen !== 0) {
            linkedName = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
            pos += nameLen;
        }

        const short7 = buffer.readInt16LE(pos);
        pos += 2;

        const testLength = buffer.readUInt8(pos);
        if(testLength === 0 || testLength > 28) {
            pos += 4;
            const testLength2 = buffer.readUInt8(pos);
            if(testLength2 === 0) pos += 1;
        }

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        GizObstacleObj.push({
            NuVecs: [ NuVec1, NuVec2, NuVec3 ],
            gameAnimSet: gameAnimSet,
            soundIdNames: SoundIdNames,
            ending: ending,
            specialSystemName: specialSystemName,
            linkedName: linkedName,
            unkownName: someName,
            floats: [ float1, float2, float3, float4, float5, float6, float7, float8, float9, float10, float11 ],
            shorts: [ short1, short2, short3, short4, short5, short6, short7 ],
            chars: [ char1, char2, char3, char4, char5, char6 ],
            ints: [ int1, int2 ]
        })
    }

    // console.log(GizObstacleObj);
    return GizObstacleObj;
}

module.exports = {
    parse: parseGizObstacle
}