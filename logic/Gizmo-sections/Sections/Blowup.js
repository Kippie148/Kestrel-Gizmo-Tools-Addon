const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//===============
// Blowup object
//===============

const BlowupObj = [];

//===============
// Blowup parser
//===============

async function parseBlowup (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    BlowupObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const nameLen = buffer.readUInt8(pos);
        if(nameLen > 40) break;
        pos += 1;

        const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
        pos += nameLen;

        let specialName = null;

        const specialNameLen = buffer.readUInt8(pos);
        if(specialNameLen < 0 || specialNameLen > 29) break;
        pos += 1;

        if(specialNameLen !== 0) {
            specialName = buffer.subarray(pos, pos + specialNameLen - 1).toString('utf-8');
            pos += specialNameLen;
        }

        const NuVec1 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        // int32 read but not stored
        pos += 4;

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

        let someName = null;

        const someNameLen = buffer.readUInt8(pos);
        if(someNameLen > 40) break;
        pos += 1

        if(someNameLen !== 0) {
            someName = buffer.subarray(pos, pos + someNameLen - 1).toString('utf-8');
            pos += someNameLen;
        }

        let particleName1 = null;
        let particleName2 = null;
        let particleName3 = null;

        const particleNameLen1 = buffer.readUInt8(pos);
        if(particleNameLen1 > 40) break;
        pos += 1;

        if(particleNameLen1 !== 0) {
            particleName1 = buffer.subarray(pos, pos + particleNameLen1 - 1).toString('utf-8');
            pos += particleNameLen1;
        }

        const particleNameLen2 = buffer.readUInt8(pos);
        if(particleNameLen2 > 40) break;
        pos += 1;

        if(particleNameLen2 !== 0) {
            particleName2 = buffer.subarray(pos, pos + particleNameLen2 - 1).toString('utf-8');
            pos += particleNameLen2;
        }

        const particleNameLen3 = buffer.readUInt8(pos);
        if(particleNameLen3 > 40) break;
        pos += 1;

        if(particleNameLen3 !== 0) {
            particleName3 = buffer.subarray(pos, pos + particleNameLen3 - 1).toString('utf-8');
            pos += particleNameLen3;
        }

        let effectName1 = null;
        let effectName2 = null;
        let effectName3 = null;
        let effectName4 = null;

        const effectNameLen1 = buffer.readUInt8(pos);
        if(effectNameLen1 > 40) break;
        pos += 1;

        if(effectNameLen1 !== 0) {
            effectName1 = buffer.subarray(pos, pos + effectNameLen1 - 1).toString('utf-8');
            pos += effectNameLen1;
        }

        const effectNameLen2 = buffer.readUInt8(pos);
        if(effectNameLen2 > 40) break;
        pos += 1;

        if(effectNameLen2 !== 0) {
            effectName2 = buffer.subarray(pos, pos + effectNameLen2 - 1).toString('utf-8');
            pos += effectNameLen2;
        }

        const effectNameLen3 = buffer.readUInt8(pos);
        if(effectNameLen3 > 40) break;
        pos += 1;

        if(effectNameLen3 !== 0) {
            effectName3 = buffer.subarray(pos, pos + effectNameLen3 - 1).toString('utf-8');
            pos += effectNameLen3;
        }

        const effectNameLen4 = buffer.readUInt8(pos);
        if(effectNameLen4 > 40) break;
        pos += 1;

        if(effectNameLen4 !== 0) {
            effectName4 = buffer.subarray(pos, pos + effectNameLen4 - 1).toString('utf-8');
            pos += effectNameLen4;
        }

        let partName1 = null;
        let partName2 = null;

        const partNameLen1 = buffer.readUInt8(pos);
        if(partNameLen1 > 40) break;
        pos += 1;

        if(partNameLen1 !== 0) {
            partName1 = buffer.subarray(pos, pos + partNameLen1 - 1).toString('utf-8');
            pos += partNameLen1;
        }

        const partNameLen2 = buffer.readUInt8(pos);
        if(partNameLen2 > 40) break;
        pos += 1;

        if(partNameLen2 !== 0) {
            partName2 = buffer.subarray(pos, pos + partNameLen2 - 1).toString('utf-8');
            pos += partNameLen2;
        }

        const Uint1 = buffer.readUInt32LE(pos);
        pos += 4;

        const Uint2 = buffer.readUInt32LE(pos);
        pos += 4;

        const int = buffer.readInt32LE(pos);
        pos += 4;

        const Uchar3 = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const Uchar4 = buffer.readUInt8(pos) !== 0;
        pos += 1;

        let legoSpecial = null;

        const legoSpecialLen = buffer.readUInt8(pos);
        if(legoSpecialLen > 40) break;
        pos += 1;

        if(legoSpecialLen !== 0) {
            legoSpecial = buffer.subarray(pos, pos + legoSpecialLen - 1).toString('utf-8');
            pos += legoSpecialLen;
        }

        const bits0to2 = (buffer.readUInt8(pos) & 0b111).toString(2).padStart(3, '0');
        pos += 1;
        
        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const float3 = buffer.readFloatLE(pos);
        pos += 4;

        const bit3 = (buffer.readUInt8(pos) & 1) !== 0;
        pos += 1;

        const bit4 = (buffer.readUInt8(pos) & 1) !== 0;
        pos += 1;

        // Int16 overwritten instantly
        pos += 2;

        let soundNameA = null;
        let soundNameB = null;
        let soundNameC = null;

        const soundNameLenA = buffer.readUInt8(pos);
        if(soundNameLenA > 40) break;
        pos += 1;

        if(soundNameLenA !== 0) {
            soundNameA = buffer.subarray(pos, pos + soundNameLenA - 1).toString('utf-8');
            pos += soundNameLenA;
        }

        const soundNameLenB = buffer.readUInt8(pos);
        if(soundNameLenB > 40) break;
        pos += 1;

        if(soundNameLenB !== 0) {
            soundNameB = buffer.subarray(pos, pos + soundNameLenB - 1).toString('utf-8');
            pos += soundNameLenB;
        }

        const soundNameLenC = buffer.readUInt8(pos);
        if(soundNameLenC > 29) break;
        pos += 1;

        if(soundNameLenC !== 0) {
            soundNameC = buffer.subarray(pos, pos + soundNameLenC - 1).toString('utf-8');
            pos += soundNameLenC;
        }

        const float4 = buffer.readFloatLE(pos);
        pos += 4;

        const float5 = buffer.readFloatLE(pos);
        pos += 4;

        const Uchar5 = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const float6 = buffer.readFloatLE(pos);
        pos += 4;

        const float7 = buffer.readFloatLE(pos);
        pos += 4;

        const short1 = buffer.readInt16LE(pos);
        pos += 2;

        const short2 = buffer.readInt16LE(pos);
        pos += 2;

        const NuVec2 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const subVersion = buffer.readInt32LE(pos); // Not fully known
        pos += 4;

        const cityBricks = await readAdd.readCityBricks(buffer, pos);
        const cityBricksEntries = cityBricks.entries;
        pos = cityBricks.offset;

        pos += 4;

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        BlowupObj.push({
            name: name,
            particles: [ particleName1, particleName2, particleName3 ],
            effects: [ effectName1, effectName2, effectName3, effectName4 ],
            sounds: [ soundNameA, soundNameB, soundNameC ],
            legoSpecial: legoSpecial,
            ending: ending,
            cityBricks: cityBricksEntries,
            NuVecs: [ NuVec1, NuVec2 ],
            int: int,
            bits: bits0to2,
            uints: [ Uint1, Uint2 ],
            shorts: [ short1, short2 ],
            bools: [ {label: 'Unknown Bit 1', values: bit3}, {label: 'Unknown Bit 2', values: bit4}, {label: 'Unknown Uchar 1', values: Uchar3}, {label: 'Unknown Uchar 2', values: Uchar4}, {label: 'Unknown Uchar 3', values: Uchar5} ],
            floats: [ float1, float2, float3, float4, float5, float6, float7 ]
        })
    }

    // console.log(BlowupObj);
    return BlowupObj;
}

module.exports = {
    parse: parseBlowup
}