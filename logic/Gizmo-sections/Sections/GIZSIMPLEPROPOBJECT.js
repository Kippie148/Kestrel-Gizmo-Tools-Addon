const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//============================
// GIZSIMPLEPROBOBJECT object
//============================

const GIZSIMPLEPROPOBJECTObj = [];

//===========================
// Parse GIZSIMPLEPROBOBJECT
//===========================

async function parseGIZSIMPLEPROBOBJECT (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    GIZSIMPLEPROPOBJECTObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const nameLen = buffer.readUInt8(pos);
        if(nameLen > 40) break;
        pos += 1;

        const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
        pos += nameLen;

        const disNameLen = buffer.readUInt8(pos);
        if(disNameLen > 40) break;
        pos += 1 + disNameLen; // Discarded name

        const NuVec1 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        pos += 4; // Discarded int32

        const float = buffer.readFloatLE(pos);
        pos += 4;

        pos += 4; // Discarded uint32

        pos += 4; // Discarded uint32

        const int1 = buffer.readInt32LE(pos);
        pos += 4;

        pos += 1; // Discarded int8

        pos += 1; // Discarded int8

        const char1 = buffer.readInt8(pos);
        pos += 1;

        const anim = await readAdd.readGameAnimSet(buffer, pos, true);
        const animSet = anim.animations;
        pos = anim.offset;

        const Uchar = buffer.readUInt8(pos);
        pos += 1;

        let soundName1 = null;
        let soundName2 = null;
        let soundName3 = null;

        const sound1Len = buffer.readUInt8(pos);
        if(sound1Len > 40) break;
        pos += 1;

        if(sound1Len !== 0) {
            soundName1 = buffer.subarray(pos, pos + sound1Len - 1).toString('utf-8');
            pos += sound1Len;
        }

        const sound2Len = buffer.readUInt8(pos);
        if(sound2Len > 40) break;
        pos += 1;

        if(sound2Len !== 0) {
            soundName2 = buffer.subarray(pos, pos + sound2Len - 1).toString('utf-8');
            pos += sound2Len;
        }

        const sound3Len = buffer.readUInt8(pos);
        if(sound3Len > 40) break;
        pos += 1;

        if(sound3Len !== 0) {
            soundName3 = buffer.subarray(pos, pos + sound3Len - 1).toString('utf-8');
            pos += sound3Len;
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

        let someName1 = null;
        let someName2 = null;
        let someName3 = null;

        const someNameLen1 = buffer.readUInt8(pos);
        if(someNameLen1 > 40) break;
        pos += 1;

        if(someNameLen1 !== 0) {
            someName1 = buffer.subarray(pos, pos + someNameLen1 - 1).toString('utf-8');
            pos += someNameLen1;
        }

        const someNameLen2 = buffer.readUInt8(pos);
        if(someNameLen2 > 40) break;
        pos += 1;

        if(someNameLen2 !== 0) {
            someName2 = buffer.subarray(pos, pos + someNameLen2 - 1).toString('utf-8');
            pos += someNameLen2;
        }

        const someNameLen3 = buffer.readUInt8(pos);
        if(someNameLen3 > 40) break;
        pos += 1;

        if(someNameLen3 !== 0) {
            someName3 = buffer.subarray(pos, pos + someNameLen3 - 1).toString('utf-8');
            pos += someNameLen3;
        }

        const int2 = buffer.readInt32LE(pos);
        pos += 4;

        const Uchar1 = buffer.readUInt8(pos); // Something with coins
        pos += 1;

        const Uchar2 = buffer.readUInt8(pos); // Same
        pos += 1;

        const short1 = buffer.readInt16LE(pos);
        pos += 2;

        const short2 = buffer.readInt16LE(pos);
        pos += 2;

        const NuVec2 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const bit0 = (buffer.readUInt8(pos) & 1) !== 1;
        pos += 1;

        const uint1 = buffer.readUInt32LE(pos);
        pos += 4;

        const bit12 = (buffer.readUInt8(pos) & 1) !== 1;
        pos += 1;

        const bit13 = (buffer.readUInt8(pos) & 1) !== 1;
        pos += 1;

        const cityBricks = await readAdd.readCityBricks(buffer, pos);
        const cityBricksEntries = cityBricks.entries;
        pos = cityBricks.offset;
        // Lego bricks load

        const uint2 = buffer.readUInt32LE(pos);
        pos += 4;

        const uint3 = buffer.readUInt32LE(pos);
        pos += 4;

        const NuVec3 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        GIZSIMPLEPROPOBJECTObj.push({
            name: name,
            animSet: animSet,
            particles: [ particleName1, particleName2, particleName3 ],
            sounds: [ soundName1, soundName2, soundName3 ],
            cityBricks: cityBricksEntries,
            ending: ending,
            NuVecs: [ NuVec1, NuVec2, NuVec3 ],
            float: float,
            char: char1,
            uchar: [ Uchar1, Uchar2 ],
            int: [ int1, int2 ],
            shorts: [ short1, short2 ],
            uint: [ uint1, uint2, uint3 ],
            bits: [ {label: 'Unknown', value: bit0}, {label: 'Unknown', value: bit12}, {label: 'Unknown', value: bit13} ]
        })
    }

    // console.log(GIZSIMPLEPROPOBJECTObj);
    return GIZSIMPLEPROPOBJECTObj;
}

module.exports = {
    parse: parseGIZSIMPLEPROBOBJECT
}