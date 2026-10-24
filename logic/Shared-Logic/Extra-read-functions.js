const fs = require('fs').promises

//================================
// Reading functions for sections
//================================

//Note:
// You might be wondering what a NuVec means. Simply said, it is just a set of three float32 which represent coordinates in these giz files.
// This is the way the engine calls it and it makes the code cleaner to read. So if you see a NuVec the result is a array of three single precision floats.

async function readNuVec (buffer, offset) {
    const vec1 = buffer.readFloatLE(offset);
    const vec2 = buffer.readFloatLE(offset + 4);
    const vec3 = buffer.readFloatLE(offset + 8);

    return [ vec1, vec2, vec3 ];
}

async function readGenericEnding (buffer, offset) {
    let pos = offset;
    let attachedObj = null;

    const nameLen = buffer.readUInt8(pos);
    if(nameLen <= 0 || nameLen > 32) return { offset: pos };
    pos += 1;

    const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
    pos += nameLen;

    const coords = await readNuVec(buffer, pos);
    pos += 12;

    // Last 10 bytes are still unknown what type. Skip for now. Only check for byte 9. Might be attachedTo or something.
    pos += 8;
    const uint1 = buffer.readUInt8(pos);
    pos += 1;

    if(uint1 !== 0) {
        attachedObj = await endingAttachedTo(buffer, pos);
        pos = attachedObj.offset;
    }

    pos += 1;

    return {
        name: name,
        coords: coords,
        attached: attachedObj,
        offset: pos
    };
}

async function endingAttachedTo (buffer, offset) {
    let pos = offset;

    const nameLen = buffer.readUInt8(pos);
    if(nameLen <= 0 || nameLen > 29) return { offset: pos }
    pos += 1;

    const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
    pos += nameLen;

    const coords = await readNuVec(buffer, pos);
    pos += 12;

    return {
        name: name,
        coords: coords,
        offset: pos
    };
}

async function readNamesInFixedBlock (buffer, pos, fixedSize, maxEntryLength, padding) {
    let nullPos;
    const nameArray = [];
    const startPos = pos;

    while (true) {
        nullPos = buffer.indexOf(0x00, pos);
        if(nullPos === -1) break;

        if(nullPos > startPos + fixedSize) break;

        if(nullPos - pos < 2 || nullPos - pos > maxEntryLength) { pos += 1; continue }

        const name = buffer.subarray(pos, nullPos).toString('utf-8');
        pos = nullPos + 1 + padding;

        nameArray.push(name);
    }

    if(nameArray.length === 0) {
        return null;
    }

    return nameArray;
}

async function readGameAnimSet (buffer, pos, isObstacle) {
    const results = [];
    
    const version = buffer.readUInt8(pos);
    pos += 1;

    const entryCount = buffer.readUInt8(pos);
    pos += 1;

    let anim;
    let float1;
    let float2;
    let int;
    if(version < 2) {
        for(let i = 0; i < entryCount; I++) {
            const nameLen = buffer.readUInt8(pos);
            if(nameLen < 0 || nameLen > 29) return { offset: pos };
            pos += 1;

            if(nameLen !== 0) {
                anim = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
                pos += nameLen;
            }

            float1 = buffer.readFloatLE(pos);
            pos += 4;

            float2 = buffer.readFloatLE(pos);
            pos += 4;

            results.push({
                animation: anim,
                floats: [ float1, float2 ],
            });
        }
    } else {
        for(let i = 0; i < entryCount; i++) {
            const nameLen = buffer.readUInt8(pos);
            if(nameLen < 0 || nameLen > 44) return { offset: pos };
            pos += 1;

            if(nameLen !== 0) {
                anim = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
                pos += nameLen;
            }

            float1 = buffer.readFloatLE(pos);
            pos += 4;

            float2 = buffer.readFloatLE(pos);
            pos += 4;

            int = buffer.readInt32LE(pos);
            pos += 4;

            if(isObstacle) {
                pos += 2;
            }

            results.push({
                animation: anim,
                floats: [ float1, float2 ],
                int: int
            });
        }
    }

    return {
        animations: results,
        offset: pos
    };
}

async function parseCityBricks (buffer, pos) {
    const entryArray = [];

    const entryCount = buffer.readUInt32LE(pos);
    pos += 4;

    for(let i = 0; i < entryCount; i++) {
        const Uint1 = buffer.readUInt32LE(pos);
        pos += 4;

        const Uint2 = buffer.readUInt32LE(pos);
        pos += 4;

        const Uint3 = buffer.readUInt32LE(pos);
        pos += 4;

        entryArray.push({
            Uints: [ Uint1, Uint2, Uint3 ]
        });
    }

    return {
        entries: entryArray,
        offset: pos
    };
}


module.exports = {
    readNuVec: readNuVec,
    readGenericEnding: readGenericEnding,
    readNamesFixedBlock: readNamesInFixedBlock,
    readGameAnimSet: readGameAnimSet,
    readCityBricks: parseCityBricks
}