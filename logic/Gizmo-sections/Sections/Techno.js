const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//===============
// Techno Object
//===============

const TechnoObj = [];

//==============
// Parse Techno
//==============

async function parseTechno (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    TechnoObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const short = buffer.readInt16LE(pos);
        pos += 2;

        let typeName = null;

        const typeLen = buffer.readUInt8(pos);
        if(typeLen > 40) break;
        pos += 1;

        if(typeLen !== 0) {
            typeName = buffer.subarray(pos, pos + typeLen - 1).toString('utf-8');
            pos += typeLen;
        }

        const Uchar1 = buffer.readUInt8(pos);
        pos += 1;

        const blockLength = buffer.readInt32LE(pos);
        if(blockLength > 40) { console.log('BlockLength wrong: ', pos); break; }
        pos += 4;

        let targetName = null;

        if(blockLength !== 0) {
            targetName = await readAdd.readNamesFixedBlock(buffer, pos, blockLength, 30, 0);
            pos += blockLength;
        }

        const Uchar2 = buffer.readUInt8(pos);
        pos += 1;

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

        const int1 = buffer.readInt32LE(pos);
        pos += 4;

        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const float3 = buffer.readFloatLE(pos);
        pos += 4;

        const int2 = buffer.readInt32LE(pos);
        pos += 4;

        const float4 = buffer.readFloatLE(pos);
        pos += 4;

        let short2 = null;

        if(version > 13) {
            short2 = buffer.readInt16LE(pos);
            pos += 2;
        }

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        TechnoObj.push({
            type: typeName,
            targetName: targetName,
            ending: ending,
            short: short,
            Uchars: [ Uchar1, Uchar2 ],
            ints: [ int1, int2 ],
            floats: [ float1, float2, float3, float4 ]
        });
    }

    // console.log(TechnoObj);
    return TechnoObj;
}

module.exports = {
    parse: parseTechno
}