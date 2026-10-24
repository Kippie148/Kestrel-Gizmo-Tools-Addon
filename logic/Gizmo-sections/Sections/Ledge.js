const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//==============
// Ledge Object
//==============

const LedgeObj = [];

//==============
// Ledge Parser
//==============

async function parseLedge (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    LedgeObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        let rotX = null;

        const rotY = buffer.readInt16LE(pos);
        pos += 2;

        if(version > 9) {
            rotX = buffer.readInt16LE(pos);
            pos += 2;
        }

        const typeSig = buffer.readUInt8(pos);
        pos += 1;
        
        let connectionLeft = null;
        let connectionRight = null;

        const nameLen1 = buffer.readUInt8(pos);
        if(nameLen1 > 40) return LedgeObj;
        pos += 1;

        if(nameLen1 !== 0) {
            connectionLeft = buffer.subarray(pos, pos + nameLen1 - 1).toString('utf-8');
            pos += nameLen1;
        }

        const nameLen2 = buffer.readUInt8(pos);
        if(nameLen2 > 40) return LedgeObj;
        pos += 1;

        if(nameLen2 !== 0) {
            connectionRight = buffer.subarray(pos, pos + nameLen2 - 1).toString('utf-8');
            pos += nameLen2;
        }

        const short3 = buffer.readInt16LE(pos);
        pos += 2;

        let Ushort = null;

        if(version > 8) {
            Ushort = buffer.readUInt16LE(pos);
            pos += 2;
        }

        const extraNameData = [];

        const nameLen3 = buffer.readUInt8(pos);
        if(nameLen3 > 40) return LedgeObj;
        pos += 1;

        if(nameLen3 !== 0) {
            const extraName = buffer.subarray(pos, pos + nameLen3 - 1).toString('utf-8');
            pos += nameLen3;

            const NuVec = await readAdd.readNuVec(buffer, pos);
            pos += 12;

            const extraShort = buffer.readInt16LE(pos);
            pos += 2;

            console.log('Extra name has been read.');

            extraNameData.push({
                name: extraName,
                coords: NuVec,
                short: extraShort
            });
        }

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;

        LedgeObj.push({
            typeSig: typeSig,
            rotation: [ rotY, rotX ],
            connectedEntries: [ connectionLeft, connectionRight ],
            // extraName: extraNameData,    Never seen. Comment back in if found or used in map manager.
            ending: ending,
            short: short3,
            ushort: Ushort
        });
    }

    // console.log(LedgeObj);
    return LedgeObj;
}

module.exports = {
    parse: parseLedge
}