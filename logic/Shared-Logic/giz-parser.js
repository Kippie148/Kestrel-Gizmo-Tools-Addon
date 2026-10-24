const fs = require('fs').promises;
const path = require('path');

//>>>>>>>>>>>>>>>
// File includes
//>>>>>>>>>>>>>>>

const headers = require('../Gizmo-sections/Headers/Headers');

// Short header sections
const GIZSIMPLEPROPOBJECT = require('../Gizmo-sections/Sections/GIZSIMPLEPROPOBJECT');
const GizObstacle = require('../Gizmo-sections/Sections/GizObstacle');
const GizSpellIt = require('../Gizmo-sections/Sections/GizSpellIt');
const GizHint = require('../Gizmo-sections/Sections/GizHint');

// Long header sections
const miniCut = require('../Gizmo-sections/Sections/MiniCut');
const tightRope = require('../Gizmo-sections/Sections/TightRope');
const GizmoPickup = require('../Gizmo-sections/Sections/GizmoPickup');
const Door = require('../Gizmo-sections/Sections/Door');
const Ledge = require('../Gizmo-sections/Sections/Ledge');
const Ladder = require('../Gizmo-sections/Sections/Ladder');
const Pole = require('../Gizmo-sections/Sections/Pole');
const Tube = require('../Gizmo-sections/Sections/Tube');
const Grapple = require('../Gizmo-sections/Sections/Grapple');
const Techno = require('../Gizmo-sections/Sections/Techno');
const Blowup = require('../Gizmo-sections/Sections/Blowup');
const Plug = require('../Gizmo-sections/Sections/Plug');
const GizSwitch = require('../Gizmo-sections/Sections/GizSwitch');
const LightBeam = require('../Gizmo-sections/Sections/LightBeam');

// Regular objects
const regularParsing = require('../Gizmo-sections/Sections/RegularObjects');

//<<<<<<<<<<<<<<
// Data objects
//<<<<<<<<<<<<<<

let headersObject = {};
//----------------

let GIZSIMPLEPROPOBJECTObj = [];
let GizObstacleObj = [];
let GizSpellItObj = [];
let GizHintObj = [];

let MiniCutObj = [];
let TightRopeObj = [];
let GizmoPickupObj = [];
let DoorObj = [];
let LedgeObj = [];
let LadderObj = [];
let PoleObj = [];
let TubeObj = [];
let GrappleObj = [];
let TechnoObj = [];
let BlowupObj = [];
let PlugObj = [];
let GizSwitchObj = [];
let LightBeamObj = [];

let regularObjects = [];

const entriesObject = [];

//======================
// Error message object
//======================

const errorObj = {
    incomplete: 0,
    sections: [],
    entriesMissed: [],
    completed: 0
};

const errorCopy = [];

//=================
// Parse this giz!
//=================

let version;

async function parseThisGiz(filePath) {
    try {
        entriesObject.length = 0;

        version = await readFileVersion(filePath);

        headersObject = await headers.parse(filePath);

        if(!await sectionControl(filePath)) return false;

        // await loadAll();

        // const util = require('util');

        // const someThing = {
        //     headers: headersObject,
        //     entries: entriesObject,
        //     fails: errorObj
        // };

        // console.log(util.inspect(someThing, {
        //     depth: null,
        //     colors: true,
        //     showHidden: false,
        //     showCircular: true,
        // }));

        return {
            version: version,
            headers: headersObject,
            entries: entriesObject,
            fails: errorObj
        };
    } catch {
        console.log('Parsing this giz file went wrong.');
        return false;
    }
    
}

//====================
// Mulitple file runs
//====================

// async function loadAll () {
//     const cache = require('../Shared-Logic/cache-manager');
//     const entriesRaw = await cache.main.get();

//     const entries = entriesRaw.indexed;

//     for(const entry of entries) {
//         console.log(path.basename(entry.path));
//         headersObject = await headers.parse(entry.path);

//         if(!await sectionControl(entry.path)) return false;
//     }
// }

//=================
// Section control
//=================

async function sectionControl (filePath) {
    try {
        if(!await shortHeaderLoading(filePath)) {
            console.log(`Short header sections parsing was incomplete: ${errorObj.incomplete} out of ${headersObject.short.length} are incomplete.\nSections are: ${errorObj.sections}`);
            for(let i = 0; i < errorObj.sections.length; i++) {
                console.log(`${errorObj.sections[i]} with ${errorObj.entriesMissed[i]} entries missed out of ${errorObj.completed + errorObj.entriesMissed[i]}.`);
            }
        }
        if(!await longHeaderLoading(filePath)) {
            console.log(`Long header sections parsing was incomplete: ${errorObj.incomplete} out of ${headersObject.long.length} are incomplete.\nThose are:`);
            for(let i = 0; i < errorObj.sections.length; i++) {
                console.log(`${errorObj.sections[i]} with ${errorObj.entriesMissed[i]} entries missed out of ${errorObj.completed + errorObj.entriesMissed[i]}.`);
            }
        }

        errorCopy.push(errorObj);
        
        errorObj.sections.length = 0;
        errorObj.entriesMissed.length = 0;
        errorObj.incomplete = 0;

        return true;
    } catch (err) {
        console.log('The section control failed.', err);
        return false;
    }   
}

async function shortHeaderLoading (filePath) {
    try {
        let perfect = true;
        for(const entry of headersObject.short) {
            // console.log('This short entry did not get parsed: ', entry.name);
            if (entry.name === 'GIZSIMPLEPROPOBJECT') {
                GIZSIMPLEPROPOBJECTObj = await GIZSIMPLEPROPOBJECT.parse(filePath, entry);
                if(GIZSIMPLEPROPOBJECTObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'GIZSIMPLEPROPOBJECT' );
                    errorObj.entriesMissed.push( entry.entryCount - GIZSIMPLEPROPOBJECTObj.length );
                    errorObj.completed = GIZSIMPLEPROPOBJECTObj.length;
                    perfect = false;
                }
                entriesObject.push(GIZSIMPLEPROPOBJECTObj);
            } else if (entry.name === 'GizObstacle') {
                GizObstacleObj = await GizObstacle.parse(filePath, entry);
                if(GizObstacleObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'GizObstacle' );
                    errorObj.entriesMissed.push( entry.entryCount - GizObstacleObj.length );
                    errorObj.completed = GizObstacleObj.length;
                    perfect = false;
                }
                entriesObject.push(GizObstacleObj);
            } else if (entry.name === 'GizSpellIt') {
                GizSpellItObj = await GizSpellIt.parse(filePath, entry);
                if(GizSpellItObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'GizSpellIt' );
                    errorObj.entriesMissed.push( entry.entryCount - GizSpellItObj.length );
                    errorObj.completed = GizSpellItObj.length;
                    perfect = false;
                }
                entriesObject.push(GizSpellItObj);
            } else if(entry.name === 'GizHint') {
                GizHintObj = await GizHint.parse(filePath, entry);
                if(GizHintObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'GizHint' );
                    errorObj.entriesMissed.push( entry.entryCount - GizHintObj.length );
                    errorObj.completed = GizHintObj.length;
                    perfect = false;
                }
                entriesObject.push(GizHintObj);
            } else {
                entriesObject.push(null);
                // console.log('Also final name not seen: ', entry.name, '=============================');
            }
        }

        return perfect;
    } catch (err) {
        console.log('The short header parsing went wrong because of:\n', err);
        return false;
    }
    
}

async function longHeaderLoading (filePath) {
    try {
        let perfect = true;
        for(const entry of headersObject.long) {
            if(entry.name === 'TightRope') {
                TightRopeObj = await tightRope.parse(filePath, entry);
                if(TightRopeObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'TightRope' );
                    errorObj.entriesMissed.push( entry.entryCount - TightRopeObj.length );
                    errorObj.completed = TightRopeObj.length;
                    perfect = false;
                }
                entriesObject.push(TightRopeObj);
            } else if(entry.name === 'MiniCut') {
                MiniCutObj = await miniCut.parse(filePath, entry);
                if(MiniCutObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'MiniCut' );
                    errorObj.entriesMissed.push( entry.entryCount - MiniCutObj.length );
                    errorObj.completed = MiniCutObj.length;
                    perfect = false;
                }
                entriesObject.push(MiniCutObj)
            } else if(entry.name === 'GizmoPickup') {
                GizmoPickupObj = await GizmoPickup.parse(filePath, entry);
                if(GizmoPickupObj.entries.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'GizmoPickup' );
                    errorObj.entriesMissed.push( entry.entryCount - GizmoPickupObj.entries.length );
                    errorObj.completed = GizmoPickupObj.entries.length;
                    perfect = false;
                }
                entriesObject.push(GizmoPickupObj);
            } else if(entry.name === 'Door') {
                DoorObj = await Door.parse(filePath, entry);
                if(DoorObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'Door' );
                    errorObj.entriesMissed.push( entry.entryCount - DoorObj.length );
                    errorObj.completed = DoorObj.length;
                    perfect = false;
                }
                entriesObject.push(DoorObj);
            } else if(entry.name === 'Ledge') {
                LedgeObj = await Ledge.parse(filePath, entry);
                if(LedgeObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'Ledge' );
                    errorObj.entriesMissed.push( entry.entryCount - LedgeObj.length );
                    errorObj.completed = LedgeObj.length;
                    perfect = false;
                }
                entriesObject.push(LedgeObj);
            } else if(entry.name === 'Ladder') {
                LadderObj = await Ladder.parse(filePath, entry);
                if(LadderObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'Ladder' );
                    errorObj.entriesMissed.push( entry.entryCount - LadderObj.length );
                    errorObj.completed = LadderObj.length;
                    perfect = false;
                }
                entriesObject.push(LadderObj);
            } else if(entry.name === 'Pole') {
                PoleObj = await Pole.parse(filePath, entry);
                if(PoleObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'Pole' );
                    errorObj.entriesMissed.push( entry.entryCount - PoleObj.length );
                    errorObj.completed = PoleObj.length;
                    perfect = false;
                }
                entriesObject.push(PoleObj);
            } else if(entry.name === 'Tube') {
                TubeObj = await Tube.parse(filePath, entry);
                if(TubeObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'Tube' );
                    errorObj.entriesMissed.push( entry.entryCount - TubeObj.length );
                    errorObj.completed = TubeObj.length;
                    perfect = false;
                }
                entriesObject.push(TubeObj);
            } else if(entry.name === 'Grapple') {
                GrappleObj = await Grapple.parse(filePath, entry);
                if(GrappleObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'Grapple' );
                    errorObj.entriesMissed.push( entry.entryCount - GrappleObj.length );
                    errorObj.completed = GrappleObj.length;
                    perfect = false;
                }
                entriesObject.push(GrappleObj);
            } else if(entry.name === 'Techno') {
                TechnoObj = await Techno.parse(filePath, entry);
                if(TechnoObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'Techno' );
                    errorObj.entriesMissed.push( entry.entryCount - TechnoObj.length );
                    errorObj.completed = TechnoObj.length;
                    perfect = false;
                }
                entriesObject.push(TechnoObj);
            } else if(entry.name === 'Blowup') {
                BlowupObj = await Blowup.parse(filePath, entry);
                if(BlowupObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'Blowup' );
                    errorObj.entriesMissed.push( entry.entryCount - BlowupObj.length );
                    errorObj.completed = BlowupObj.length;
                    perfect = false;
                }
                entriesObject.push(BlowupObj);
            } else if(entry.name === 'Plug') {
                PlugObj = await Plug.parse(filePath, entry);
                if(PlugObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'Plug' );
                    errorObj.entriesMissed.push( entry.entryCount - PlugObj.length );
                    errorObj.completed = PlugObj.length;
                    perfect = false;
                }
                entriesObject.push(PlugObj);
            } else if(entry.name === 'GizSwitch') {
                GizSwitchObj = await GizSwitch.parse(filePath, entry);
                if(GizSwitchObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'GizSwitch' );
                    errorObj.entriesMissed.push( entry.entryCount - GizSwitchObj.length );
                    errorObj.completed = GizSwitchObj.length;
                    perfect = false;
                }
                entriesObject.push(GizSwitchObj);
            } else if(entry.name === 'LightBeam') {
                LightBeamObj = await LightBeam.parse(filePath, entry);
                if(LightBeamObj.length < entry.entryCount) {
                    errorObj.incomplete += 1;
                    errorObj.sections.push( 'LightBeam' );
                    errorObj.entriesMissed.push( entry.entryCount - LightBeamObj.length );
                    errorObj.completed = LightBeamObj.length;
                    perfect = false;
                }
                entriesObject.push(LightBeamObj);
            } else if (entry.name === 'RegularObjects') {
                regularObjects = await regularParsing.parse(filePath, entry.offset); // Not actually has a long header but this is much easier to load it this way.
                entry.entryCount = regularObjects.entryAmount;
                entriesObject.push(regularObjects.entries);
            } else {
                entriesObject.push(null);
                // console.log('This long header entry is not being parsed yet: ', entry.name);
            }
        }

        return perfect;
    } catch (err) {
        console.log('The long header parsing went wrong because of:\n', err);
        return false;
    }
}

//===================
// Read file version
//===================

async function readFileVersion(filePath) {
    try {
        const fileHandle = await fs.open(filePath, 'r');

        const buffer = Buffer.alloc(8);

        const { bytesRead } = await fileHandle.read(buffer, 0, 8, 0);

        await fileHandle.close();

        const fileVersion = buffer.readUInt32LE();

        if (fileVersion <= 0 || fileVersion > 30) {
            console.log('No valid file version was detected.');
            return undefined;
        } else {
            return fileVersion;
        }
    } catch (err) {
        console.log('Something went wrong while reading the file version.\n', err);
        return undefined;
    }
}

// Note:
// It is not confirmed that this is a file version/editor version yet. Might also be magic but it does fit with the version ranges this game uses.

module.exports = {
    parseGiz: parseThisGiz
}

