const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//====================
// GizmoPickup object
//====================
const GizmoPickupEntryObj = [];

//=====================
// GizmoPickup parsing
//=====================

async function parseGizmoPickup (filePath, headerEntry) {
    const buffer = await fs.readFile(filePath);

    let GPHeader = {};

    const version = headerEntry.version;

    let pos = headerEntry.offset;

    const uint = buffer.readUint32LE(pos);
    pos += 4;

    const drawDistance = buffer.readFloatLE(pos);
    pos += 4;

    const scale = buffer.readFloatLE(pos);
    pos += 4;

    const float1 = buffer.readFloatLE(pos);
    pos += 4;

    const float2 = buffer.readFloatLE(pos);
    pos += 4;

    const float3 = buffer.readFloatLE(pos);
    pos += 4;

    const float4 = buffer.readFloatLE(pos);
    pos += 4;

    GPHeader = {
        Scale: scale,
        drawDistance: drawDistance,
        uint: uint,
        floats: [ float1, float2, float3, float4 ]
    };

    GizmoPickupEntryObj.length = 0;

    for(let i = 0; i < headerEntry.entryCount; i++) {   
        const typeSig = buffer.readUInt8(pos);
        pos += 1;

        const Ushort = buffer.readUInt16LE(pos); // High values extends pickup range, but 1 makes it dissapear.
        pos += 2;

        const char = buffer.readInt8(pos); // Unknown
        pos += 1;

        const short = buffer.readInt16LE(pos); // Unknown
        pos += 2;

        const respawnDistance = buffer.readFloatLE(pos); // Respawn distance
        pos += 4;

        const ending = await readAdd.readGenericEnding(buffer, pos);
        if(ending.length === 0) return { header: GPHeader, entries: GizmoPickupEntryObj };
        pos = ending.offset;

        GizmoPickupEntryObj.push({
            typeSig: typeSig,
            respawnDistance: respawnDistance,
            char: char,
            short: short,
            Ushort: Ushort,
            ending: ending
        });
    }

    // console.log(GPHeader);
    // console.log(GizmoPickupEntryObj);
    return {
        header: GPHeader,
        entries: GizmoPickupEntryObj
    };
}

module.exports = {
    parse: parseGizmoPickup
}