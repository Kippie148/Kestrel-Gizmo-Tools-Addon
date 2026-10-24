const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//==================
// Tightrope object
//==================

const TightRopeObj = [];

//==================
// TightRope parser
//==================

async function parseTightRope (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    TightRopeObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        let uchar11;
        let uchar12;
        
        const nameLen = buffer.readUInt8(pos);
        if(nameLen > 29) return TightRopeObj;
        pos += 1;

        const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
        pos += nameLen;

        const coords1 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const coords2 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const coords3 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const coords4 = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const rotX1 = buffer.readUInt16LE(pos);
        pos += 2;

        const rotX2 = buffer.readUInt16LE(pos);
        pos += 2;

        const rotY1 = buffer.readUInt16LE(pos);
        pos += 2;

        const rotY2 = buffer.readUInt16LE(pos);
        pos += 2;

        const base1Vis = buffer.readUInt8(pos) !== 0;
        pos += 1;
        
        const base2Vis = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const char1 = buffer.readInt8(pos);
        pos += 1;

        const ropeType = buffer.readInt8(pos);
        pos += 1;

        let checkAttached = buffer.readInt8(pos);
        if(checkAttached > 0) {
            // Attached to code. Haven't figured out what it is though.
            // This seems to have a id of 0
        }
        pos += 1;
        checkAttached = buffer.readInt8(pos);
        if(checkAttached > 0) {
            // Wow still haven't figured it out
            // This has some sort of id with hardcoded value 1
        }
        pos += 1;

        const ushort5 = buffer.readUInt16LE(pos);
        pos += 2;

        const ushort6 = buffer.readUInt16LE(pos);
        pos += 2;

        const heightType = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const uchar4 = buffer.readUInt8(pos);
        pos += 1;

        const slowWalk = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const uchar6 = buffer.readUInt8(pos);
        pos += 1;

        const autoJumpOff = buffer.readUInt8(pos) !== 0;
        pos += 1;

        const uchar8 = buffer.readUInt8(pos);
        pos += 1;

        const uchar9 = buffer.readUInt8(pos);
        pos += 1;

        const uchar10 = buffer.readUInt8(pos);
        pos += 1;

        if(version !== 17) {
            uchar11 = buffer.readUInt8(pos);
            pos += 1;
            if(version > 18) {
                uchar12 = buffer.readUInt8(pos);
                pos += 1;
            }
        }

        const ending = await readAdd.readGenericEnding(buffer, pos);
        if(ending.length === 0) return TightRopeObj;
        pos = ending.offset;

        TightRopeObj.push({
            name: name,
            coords: [ coords1, coords2, coords3, coords4 ],
            rotation1: [ rotX1, rotY1 ],
            rotation2: [ rotX2, rotY2 ],
            booleans: [ { label: 'Base 1 Invisible', value: base1Vis }, { label: 'Base 2 Invisible', value: base2Vis }, { label: 'High Rope', value: heightType }, { label: 'Slow walk Rope', value: slowWalk }, { label: 'Turn Off Auto Jump', value: autoJumpOff } ],
            ropeType: ropeType,
            ending: ending,
            ushorts: [ ushort5, ushort6 ],
            char: char1,
            uchars: [ uchar4, uchar6, uchar8, uchar9, uchar10, uchar11, uchar12 ]
        });
    }

    // console.log(TightRopeObj);
    return TightRopeObj;
}

module.exports = {
    parse: parseTightRope
}