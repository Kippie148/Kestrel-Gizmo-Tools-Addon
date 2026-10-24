const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//================
// Grapple Object
//================

const GrappleObj = [];

//===============
// Parse Grapple
//===============

async function parseGrapple (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    GrappleObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {
        if(version < 17) {
            pos += 60;
        } else {
            pos += 78;
        }

        // Huge skip, contents found but implementation is coming later.
        
        const nameLen = buffer.readUInt8(pos);
        if(nameLen > 40) break;
        pos += 1;

        const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
        pos += nameLen;

        const NuVec = await readAdd.readNuVec(buffer, pos);
        pos += 12;

        const Ushort1 = buffer.readUInt16LE(pos);
        pos += 2;

        const float1 = buffer.readFloatLE(pos);
        pos += 4;

        const bit0 = buffer.readUInt8(pos) & 1
        pos += 1;

        const float2 = buffer.readFloatLE(pos);
        pos += 4;

        const Ushort2 = buffer.readUInt16LE(pos);
        pos += 2;

        const bit1 = buffer.readUInt8(pos) & 1;
        pos += 1;

        const specialNameLen = buffer.readUInt8(pos);
        if(specialNameLen > 40) break;
        pos += 1;

        let specialName = null;

        if(specialNameLen !== 0) {
            specialName = buffer.subarray(pos, pos + specialNameLen - 1).toString('utf-8');
            pos += specialNameLen;
        }

        const bit3 = buffer.readUInt8(pos) & 1;
        pos += 1;

        const Uchar1 = buffer.readUInt8(pos);
        pos += 1;

        const someNameLen = buffer.readUInt8(pos);
        if(someNameLen > 40) break;
        pos += 1;

        let someName = null;

        if(someNameLen !== 0) {
            someName = buffer.subarray(pos, pos + someNameLen - 1).toString('utf-8');
            pos += someNameLen;
        }

        const bits4to11 = buffer.readUInt8(pos).toString(2).padStart(8, '0');
        pos += 1;

        let Uchar2 = null;
        let Ushort3 = null;
        let float3 = null;

        if(version < 17) {
            Uchar2 = buffer.readUInt8(pos);
            pos += 1;
        } else {
            const Ushort3 = buffer.readUInt16LE(pos);
            pos += 2;
            if(version !== 17) {
                const float3 = buffer.readFloatLE(pos);
                pos += 4;
            }
        }

        const ending = await readAdd.readGenericEnding(buffer, pos);
        pos = ending.offset;
        
        GrappleObj.push({
            name: name,
            coords: NuVec,
            specialName: specialName,
            someName: someName,
            ending: ending,
            uchars: [ Uchar1, Uchar2 ],
            ushorts: [ Ushort1, Ushort2, Ushort3 ],
            floats: [ float1, float2, float3 ],
            bits: [ bit0, bit1, bit3, bits4to11 ]
        });
    }

    // console.log(GrappleObj);
    return GrappleObj;
}

module.exports = {
    parse: parseGrapple
}