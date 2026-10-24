const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//==================
// GizSwitch Object
//==================

const GizSwitchObj = [];

//=================
// Parse GizSwitch
//=================

async function parseGizSwitch (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    GizSwitchObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const Ushort1 = buffer.readUInt16LE(pos);
        pos += 2;

        const anim = await readAdd.readGameAnimSet(buffer, pos, true);
        pos = anim.offset;
        const animSet = anim.animations;

        const Ushort2 = buffer.readUInt16LE(pos);
        pos += 2;
        
        const checkBit = ((Ushort2 >> 10) & 1) === 1;

        const Uint = buffer.readUInt32LE(pos);
        pos += 4;

        let actionFromName1 = null;
        let actionFromName2 = null;
        let actionFromName3 = null;

        const actionNameLen1 = buffer.readUInt8(pos);
        if(actionNameLen1 > 40) break;
        pos += 1;

        if(actionNameLen1 !== 0) {
            actionFromName1 = buffer.subarray(pos, pos + actionNameLen1 - 1).toString('utf-8');
            pos += actionNameLen1;
        }

        const actionNameLen2 = buffer.readUInt8(pos);
        if(actionNameLen2 > 40) break;
        pos += 1;

        if(actionNameLen2 !== 0) {
            actionFromName2 = buffer.subarray(pos, pos + actionNameLen2 - 1).toString('utf-8');
            pos += actionNameLen2;
        }

        const actionNameLen3 = buffer.readUInt8(pos);
        if(actionNameLen3 > 40) break;
        pos += 1;

        if(actionNameLen3 !== 0) {
            actionFromName3 = buffer.subarray(pos, pos + actionNameLen3 - 1).toString('utf-8');
            pos += actionNameLen3;
        }

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

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

        const Uchar1 = buffer.readUInt8(pos);
        pos += 1;

        const Uchar2 = buffer.readUInt8(pos);
        pos += 1;

        const Uchar3 = buffer.readUInt8(pos);
        pos += 1;

        let soundName1 = null;
        let soundName2 = null;

        const soundName1Len = buffer.readUInt8(pos);
        if(soundName1Len > 40) break;
        pos += 1;

        if(soundName1Len !== 0) {
            soundName1 = buffer.subarray(pos, pos + soundName1Len - 1).toString('utf-8');
            pos += soundName1Len;
        }

        const soundName2Len = buffer.readUInt8(pos);
        if(soundName2Len > 40) break;
        pos += 1;

        if(soundName2Len !== 0) {
            soundName2 = buffer.subarray(pos, pos + soundName2Len - 1).toString('utf-8');
            pos += soundName2Len;
        }

        let float7 = null;

        // if(checkBit) {
            float7 = buffer.readFloatLE(pos);
            pos += 4;
        // }

        const float8 = buffer.readFloatLE(pos);
        pos += 4

        const float9 = buffer.readFloatLE(pos);
        pos += 4;

        let characterCdName = null;

        const characterLen = buffer.readUInt8(pos);
        if(characterLen > 32) break;
        pos += 1;

        // Unused in this game.
        // if(characterLen !== 0) {
        //     characterCdName = buffer.subarray(pos, pos + characterLen - 1).toString('utf-8');
        //     pos += characterLen;
        // }

        pos += 4;

        let extraName = null;

        const extraNameLen = buffer.readUInt8(pos);
        if(extraNameLen > 32) break;
        pos += 1;

        if(extraNameLen !== 0) {
            extraName = buffer.subarray(pos, pos + extraNameLen - 1).toString('utf-8');
            pos += extraNameLen;
            pos += 2;
        }
        
        pos += 4;

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        GizSwitchObj.push({
            // characterCdName: characterCdName, Unused
            actionNames: [ actionFromName1, actionFromName2, actionFromName3 ],
            sounds: [ soundName1, soundName2 ],
            extraName: extraName,
            animset: animSet,
            ending: ending,
            Uint: Uint,
            shorts: [ Ushort1, Ushort2 ],
            Uchars: [ Uchar1, Uchar2, Uchar3 ],
            floats: [ float1, float2, float3, float4, float5, float6, float7, float8, float9 ]
        });
    }

    // console.log(GizSwitchObj);
    return GizSwitchObj;
}

module.exports = {
    parse: parseGizSwitch
}