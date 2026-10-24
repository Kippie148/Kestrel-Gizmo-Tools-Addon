const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//================
// MiniCut Object
//================

const MiniCutObj = [];

//================
// MiniCut parser
//================

async function parseMiniCut (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset

    MiniCutObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        const subentries = [];

        const nameLen = buffer.readUInt8(pos);
        if(nameLen > 40) break;
        pos += 1;

        const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
        pos += nameLen;

        const char1 = buffer.readInt8(pos);
        pos += 1;

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const startDelay = buffer.readFloatLE(pos);
        pos += 4;

        const intitialSlowdown = buffer.readFloatLE(pos);
        pos += 4;

        const float5 = buffer.readFloatLE(pos);
        pos += 4;

        const stagesLen = buffer.readUInt8(pos);
        pos += 1;

        if(stagesLen === 0) {
            i--;
            MiniCutObj.push({
                name: name,
                startDelay: startDelay,
                intitialSlowdown: intitialSlowdown,
                floats: [ float1, float2, float5 ],
                char: char1,
                uchar: null,
                subEntryCount: stagesLen,
                subentries: subentries
            });
            continue;
        }

        for(let j = 0; j < stagesLen; j++) {
            let subName = null;
            
            const subnameLen = buffer.readUInt8(pos);
            if(subnameLen > 40) break;
            pos += 1;

            if(subnameLen !== 0) {
                subName = buffer.subarray(pos, pos + subnameLen).toString('utf-8');
                pos += subnameLen;
            }
            
            const coords = await readAdd.readNuVec(buffer, pos); // Not a NuVec according to the game but these are 3 coords so using this function is cleaner and quicker.
            pos += 12;

            const zoom = buffer.readFloatLE(pos);
            pos += 4;

            const rotY = buffer.readUInt16LE(pos);
            pos += 2;

            const rotX = buffer.readUInt16LE(pos);
            pos += 2;

            const rotZ = buffer.readUInt16LE(pos);
            pos += 2;

            const transitionSlowdown = buffer.readFloatLE(pos);
            pos += 4;

            const float7 = buffer.readFloatLE(pos);
            pos += 4;

            let float8 = null;
            if(version > 6) {
                float8 = buffer.readFloatLE(pos);
                pos += 4;
            }

            let uchar1 = null;
            if(version > 5) {
                const uchar1 = buffer.readUInt8(pos);
                pos += 1;
            }

            subentries.push({
                name: subName,
                coords: coords,
                zoom: zoom,
                transitionSlowdown: transitionSlowdown,
                rotations: [ rotY, rotX, rotZ ],
                floats: [ float7, float8 ],
                uchar: uchar1
            });

            // console.log(subentries);
        }

        const uchar1 = buffer.readUInt8(pos);
        pos += 1;

        const obj = await readAdd.readGenericEnding(buffer, pos);
        if(obj.length === 0) break;
        pos = obj.offset;

        MiniCutObj.push({
            name: name,
            startDelay: startDelay,
            initialSlowdown: intitialSlowdown,
            floats: [ float1, float2, float5 ],
            char: char1,
            uchar: uchar1,
            subEntryCount: stagesLen,
            subentries: subentries
        });
    }

    // console.log(MiniCutObj);
    return MiniCutObj;
}


module.exports = {
    parse: parseMiniCut
}