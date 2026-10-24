const fs = require('fs').promises;
const readAdd = require('../../Shared-Logic/Extra-read-functions');

//=========
// Objects
//=========

const GIZSIMPLEPROPOBJECT = [];
const GizObstacle = [];
const GizSpellIt = [];
const ComplexGizmo = [];
const GizSwitch = [];
const Blowup = [];
const GizItem = [];
const GizSuperBuild = [];
const PushBlocks2 = [];

let entryAmount = 0;

//===================
// Parsing functions
//===================

async function parsingControl (filePath, offset) {
    try {
        const buffer = await fs.readFile(filePath);

        let pos = offset;

        await emptyObjects();

        while(pos < buffer.length) {
            pos += 4;

            const nameLen = buffer.readUInt8(pos);
            if(nameLen === 0 || nameLen > 40) break;
            pos += 1;

            const name = buffer.subarray(pos, pos + nameLen - 1).toString('utf-8');
            pos += nameLen;

            const classLen = buffer.readUInt8(pos);
            pos += 1;

            const className = buffer.subarray(pos, pos + classLen - 1).toString('utf-8');
            pos += classLen;

            entryAmount += 1;

            switch (className) {
                case ('GIZSIMPLEPROPOBJECT'):
                    pos = await parseGSPO(buffer, pos, name);
                    continue;
                case ('GizObstacle'):
                    pos = await parseGO(buffer, pos, name);
                    continue;
                case ('GizSpellIt'):
                    pos = await parseGS(buffer, pos, name);
                    continue;
                case ('ComplexGizmo'):
                    pos = await parseCG(buffer, pos, name);
                    continue;
                case ('GizSwitch'):
                    pos = await parseGSW(buffer, pos, name);
                    continue;
                case ('Blowup'):
                    pos = await parseB(buffer, pos, name);
                    continue;
                case ('GizItem'):
                    pos = await parseGI(buffer, pos, name);
                    continue;
                case ('GizSuperBuild'):
                    pos = await parseGSB(buffer, pos, name);
                    continue;
                case ('PushBlocks2'):
                    pos = await parsePB(buffer, pos, name);
                    continue;
                default:
                    console.log('The class is not valid.\n', className);
                    continue;
            }
        }

        return {
            entries: [...GIZSIMPLEPROPOBJECT, ...GizObstacle, ...GizSpellIt, ...ComplexGizmo, ...GizSwitch, ...Blowup, ...GizItem, ...GizSuperBuild, ...PushBlocks2], 
            entryAmount: entryAmount
        };
    } catch (err) {
        console.log('Parsing regular objects went wrong.\n', err);
        return regularObjects;
    }
}

async function parseGSPO (buffer, pos, name) {
    const idLen = buffer.readUInt8(pos);
    pos += 1;

    const idName = buffer.subarray(pos, pos + idLen - 1).toString('utf-8');
    pos += idLen;

    const coords = await readAdd.readNuVec(buffer, pos);
    pos += 12;

    const rotY = buffer.readUInt16LE(pos);
    pos += 2;

    const rotX = buffer.readUInt16LE(pos);
    pos += 2;

    const endlineLength = buffer.readUint8(pos + 6);

    const endline = buffer.subarray(pos, pos + 6 + endlineLength).toString('hex');

    pos += 6 + endlineLength;

    GIZSIMPLEPROPOBJECT.push({
        name: name,
        id: idName,
        className: 'GIZSIMPLEPROPOBJECT',
        coords: coords,
        rotY: rotY,
        rotX: rotX,
        endline: endline,
        pos: pos
    });

    return pos;
}

async function parseGO (buffer, pos, name) {
    const idLen = buffer.readUInt8(pos);
    pos += 1;

    const idName = buffer.subarray(pos, pos + idLen - 1).toString('utf-8');
    pos += idLen;

    const coords = await readAdd.readNuVec(buffer, pos);
    pos += 12;

    const rotY = buffer.readUInt16LE(pos);
    pos += 2;

    const rotX = buffer.readUInt16LE(pos);
    pos += 2;

    pos += 6;

    let endlineLength = buffer.readUint8(pos);

    pos += 9

    const attachedLen = buffer.readUInt8(pos);
    pos += 1;

    let attachedName = null;
    let attachedName2 = null;

    if(attachedLen !== 0) {
        attachedName = buffer.subarray(pos, pos + attachedLen - 1).toString('utf-8');
        pos += attachedLen;
    }

    pos += 2;

    const attachedLen2 = buffer.readUInt8(pos);
    pos += 1;

    if(attachedLen2 !== 0) {
        attachedName2 = buffer.subarray(pos, pos + attachedLen2 - 1).toString('utf-8');
        pos += attachedLen2;
    }

    const endlinePosLength = endlineLength - 9 - 1 - attachedLen - 2 - 1 - attachedLen2; 

    pos += endlinePosLength;

    const endline = buffer.subarray(pos - endlineLength - 6, pos).toString('hex');

    GizObstacle.push({
        name: name,
        id: idName,
        className: 'GizObstacle',
        coords: coords,
        rotY: rotY,
        rotX: rotX,
        attachedName1: attachedName,
        attachedName2: attachedName2,
        endline: endline
    });

    return pos;
}

async function parseGS (buffer, pos, name) {
    const idLen = buffer.readUInt8(pos);
    pos += 1;

    const idName = buffer.subarray(pos, pos + idLen - 1).toString('utf-8');
    pos += idLen;

    const coords = await readAdd.readNuVec(buffer, pos);
    pos += 12;

    const rotY = buffer.readUInt16LE(pos);
    pos += 2;

    const rotX = buffer.readUInt16LE(pos);
    pos += 2;

    const endlineLength = buffer.readUint8(pos + 6);

    const endline = buffer.subarray(pos, pos + 6 + endlineLength).toString('hex');

    pos += 6 + endlineLength;

    GizSpellIt.push({
        name: name,
        id: idName,
        className: 'GizSpellIt',
        coords: coords,
        rotY: rotY,
        rotX: rotX,
        endline: endline
    });

    return pos;
}

async function parseCG (buffer, pos, name) {
    const idLen = buffer.readUInt8(pos);
    pos += 1;

    const idName = buffer.subarray(pos, pos + idLen - 1).toString('utf-8');
    pos += idLen;

    const coords = await readAdd.readNuVec(buffer, pos);
    pos += 12;

    const rotY = buffer.readUInt16LE(pos);
    pos += 2;

    const rotX = buffer.readUInt16LE(pos);
    pos += 2;

    const endlineLength = buffer.readUint8(pos + 6);

    const endline = buffer.subarray(pos, pos + 6 + endlineLength).toString('hex');

    pos += 6 + endlineLength;

    ComplexGizmo.push({
        name: name,
        id: idName,
        className: 'ComplexGizmo',
        coords: coords,
        rotY: rotY,
        rotX: rotX,
        endline: endline
    });

    return pos;
}

async function parseGSW (buffer, pos, name) {
    const idLen = buffer.readUInt8(pos);
    pos += 1;

    const idName = buffer.subarray(pos, pos + idLen - 1).toString('utf-8');
    pos += idLen;

    const coords = await readAdd.readNuVec(buffer, pos);
    pos += 12;

    const rotY = buffer.readUInt16LE(pos);
    pos += 2;

    const rotX = buffer.readUInt16LE(pos);
    pos += 2;

    const endlineLength = buffer.readUint8(pos + 6);

    const endline = buffer.subarray(pos, pos + 6 + endlineLength).toString('hex');

    pos += 6 + endlineLength;

    GizSwitch.push({
        name: name,
        id: idName,
        className: 'GizSwitch',
        coords: coords,
        rotY: rotY,
        rotX: rotX,
        endline: endline
    });

    return pos;
}

async function parseB (buffer, pos, name) {
    const idLen = buffer.readUInt8(pos);
    pos += 1;

    const idName = buffer.subarray(pos, pos + idLen - 1).toString('utf-8');
    pos += idLen;

    const coords = await readAdd.readNuVec(buffer, pos);
    pos += 12;

    const rotY = buffer.readUInt16LE(pos);
    pos += 2;

    const rotX = buffer.readUInt16LE(pos);
    pos += 2;

    const endlineLength = buffer.readUint8(pos + 6);

    const endline = buffer.subarray(pos, pos + 6 + endlineLength).toString('hex');

    pos += 6 + endlineLength;

    Blowup.push({
        name: name,
        id: idName,
        className: 'Blowup',
        coords: coords,
        rotY: rotY,
        rotX: rotX,
        endline: endline
    });

    return pos;
}

async function parseGI (buffer, pos, name) {
    const idLen = buffer.readUInt8(pos);
    pos += 1;

    const idName = buffer.subarray(pos, pos + idLen - 1).toString('utf-8');
    pos += idLen;

    const coords = await readAdd.readNuVec(buffer, pos);
    pos += 12;

    const rotY = buffer.readUInt16LE(pos);
    pos += 2;

    const rotX = buffer.readUInt16LE(pos);
    pos += 2;

    const endlineLength = buffer.readUint8(pos + 6);

    const endline = buffer.subarray(pos, pos + 6 + endlineLength).toString('hex');

    pos += 6 + endlineLength;

    GizItem.push({
        name: name,
        id: idName,
        className: 'GizItem',
        coords: coords,
        rotY: rotY,
        rotX: rotX,
        endline: endline,
        pos: pos
    });

    return pos;
}

async function parseGSB (buffer, pos, name) {
    const idLen = buffer.readUInt8(pos);
    pos += 1;

    const idName = buffer.subarray(pos, pos + idLen - 1).toString('utf-8');
    pos += idLen;

    const coords = await readAdd.readNuVec(buffer, pos);
    pos += 12;

    const rotY = buffer.readUInt16LE(pos);
    pos += 2;

    const rotX = buffer.readUInt16LE(pos);
    pos += 2;

    const endlineLength = buffer.readUint8(pos + 6);

    const endline = buffer.subarray(pos, pos + 6 + endlineLength).toString('hex');

    pos += 6 + endlineLength;

    GizSuperBuild.push({
        name: name,
        id: idName,
        className: 'GizSuperBuild',
        coords: coords,
        rotY: rotY,
        rotX: rotX,
        endline: endline
    });

    return pos;
}

async function parsePB (buffer, pos, name) {
    const idLen = buffer.readUInt8(pos);
    pos += 1;

    const idName = buffer.subarray(pos, pos + idLen - 1).toString('utf-8');
    pos += idLen;

    const coords = await readAdd.readNuVec(buffer, pos);
    pos += 12;

    const rotY = buffer.readUInt16LE(pos);
    pos += 2;

    const rotX = buffer.readUInt16LE(pos);
    pos += 2;

    const endlineLength = buffer.readUint8(pos + 6);

    const endline = buffer.subarray(pos, pos + 6 + endlineLength).toString('hex');

    pos += 6 + endlineLength;

    PushBlocks2.push({
        name: name,
        id: idName,
        className: 'PushBlocks2',
        coords: coords,
        rotY: rotY,
        rotX: rotX,
        endline: endline
    });

    return pos;
}

async function emptyObjects () {
    GIZSIMPLEPROPOBJECT.length = 0;
    GizObstacle.length = 0;
    GizSpellIt.length = 0;
    ComplexGizmo.length = 0;
    GizSwitch.length = 0;
    GizItem.length = 0;
    Blowup.length = 0;
    GizSuperBuild.length = 0;
    PushBlocks2.length = 0;

    entryAmount = 0;
}

module.exports = {
    parse: parsingControl
}