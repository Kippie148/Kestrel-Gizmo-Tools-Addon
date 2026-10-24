import{
    makeUiListHeader,
    makeUiListEntry,
    makeUiListEntryRegularObjects,
    makeUiListEntryPickUp
} from './components.js';

import{
    getPickupType,
    getDefaultRopeType,
    getHeaderColor,
    getPickupColor,
    getRopeColor
} from './signatures.js';

export function regularObjectListData (entries) {
    const header = makeUiListHeader(['Name', 'ID', 'Class', 'Position']);
    
    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.coords[0].toFixed(2)} ` + `Y:${entry.coords[1].toFixed(2)} ` + `Z:${entry.coords[2].toFixed(2)}`;

        const row = makeUiListEntryRegularObjects([entry.name, entry.id, entry.className, position], pos);

        row.children[2].style.color = getHeaderColor(entry.className);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function blowupListData (entries) {
    const header = makeUiListHeader(['Name', 'Particle 1', 'Sounds 1', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        if(entry.particles[0] === null) {
            entry.particles[0] = 'No Particle 1';
        }

        if(entry.sounds[0] === null) {
            entry.sounds[0] = 'No Sound 1';
        }

        const row = makeUiListEntry([entry.name, entry.particles[0], entry.sounds[0], position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function doorListData (entries) {
    const header = makeUiListHeader(['Name', 'Destination', 'Cutscene', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        if(entry.dest === null) {
            entry.dest = 'No Destination';
        }

        const row = makeUiListEntry([entry.ending.name, entry.dest, entry.cutScene, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function gizHintListData (entries) {
    const header = makeUiListHeader(['Name', 'Extra Name 1', 'Special Name', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        if(entry.extraNames[0] === null) {
            entry.extraNames[0] = 'No Extra Name';
        }

        if(entry.specialName === null) {
            entry.specialName = 'No Special Name';
        }

        const row = makeUiListEntry([entry.hintName, entry.extraNames[0], entry.specialName, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function gizmoPickupListData (entries) {
    const header = makeUiListHeader(['Name', 'Type', 'Respawn Distance', 'Position']);

    const rows = [];
    let pos = 0;

    rows.push(makeUiListEntryPickUp(['Header', `Scale ${entries[0].Scale}`, `Draw Distance ${entries[0].drawDistance}`, `Uint ${entries[0].uint}`], 0));

    entries.shift();

    for(const entry of entries) {
        pos += 1;
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;
        const pickupType = getPickupType(entry.typeSig);

        const row = makeUiListEntry([entry.ending.name, pickupType, entry.respawnDistance, position], pos);

        row.children[1].style.color = getPickupColor(entry.typeSig);

        rows.push(row);
    }

    return {
        header,
        rows
    };
}

export function gizObstacleListData (entries) {
    const header = makeUiListHeader(['Name', 'Linked Name', 'Sound 1', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        if(entry.linkedName === null) {
            entry.linkedName = 'No Linked Name';
        }

        if(entry.soundIdNames[0] === null) {
            entry.soundIdNames[0] = 'No Sound 1';
        }

        const row = makeUiListEntry([entry.ending.name, entry.linkedName, entry.soundIdNames[0], position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function GIZSIMPLEPROPOBJECTListData (entries) {
    const header = makeUiListHeader(['Name', 'Particle 1', 'Sound 1', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        if(entry.particles[0] === null) {
            entry.particles[0] = 'No Particle 1';
        }

        if(entry.sounds[0] === null) {
            entry.sounds[0] = 'No Sound 1';
        }

        const row = makeUiListEntry([entry.ending.name, entry.particles[0], entry.sounds[0], position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function gizSpellItListData (entries) {
    const header = makeUiListHeader(['Name', 'First Extra Position', 'Animation Amount', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        const row = makeUiListEntry([entry.ending.name, entry.NuVecs[0], entry.animSet.length, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function gizSwitchListData (entries) {
    const header = makeUiListHeader(['Name', 'Action Name 1', 'Sound 1', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        if(entry.actionNames[0] === null) {
            entry.actionNames[0] = 'No Action 1';
        }

        if(entry.sounds[0] === null) {
            entry.sounds[0] = 'No Sound 1';
        }

        const row = makeUiListEntry([entry.ending.name, entry.actionNames[0], entry.sounds[0], position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function grappleListData (entries) {
    const header = makeUiListHeader(['Name', 'Special Name', 'Some Name', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.coords[0].toFixed(2)} ` + `Y:${entry.coords[1].toFixed(2)} ` + `Z:${entry.coords[2].toFixed(2)}`;

        if(entry.specialName === null) {
            entry.actionName = 'No Special Name';
        }

        if(entry.someName === null) {
            entry.someName = 'No Some Name';
        }

        const row = makeUiListEntry([entry.name, entry.actionName, entry.someName, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function ladderListData (entries) {
    const header = makeUiListHeader(['Name', 'Type', 'Height', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        const row = makeUiListEntry([entry.ending.name, entry.type, entry.height, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function ledgeListData (entries) {
    const header = makeUiListHeader(['Name', 'Type Signature', 'Connected Entry', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        let connectedEntry;

        if(entry.connectedEntries[0] === null && entry.connectedEntries[1] === null) {
            connectedEntry = 'No Connected Entry';
        } else if (entry.connectedEntries[0] !== null) {
            connectedEntry = entry.connectedEntries[0];
        } else {
            connectedEntry = entry.connectedEntries[1];
        }

        const row = makeUiListEntry([entry.ending.name, entry.typeSig, connectedEntry,  position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function lightBeamListData (entries) {
    const header = makeUiListHeader(['Name', 'Short 1', 'Short 2', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        const row = makeUiListEntry([entry.ending.name, entry.shorts[0], entry.shorts[1], position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function miniCutListData (entries) {
    const header = makeUiListHeader(['Name', 'Stage Amount', 'Start Delay', 'First Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.subentries[0].coords[0].toFixed(2)} ` + `Y:${entry.subentries[0].coords[1].toFixed(2)} ` + `Z:${entry.subentries[0].coords[2].toFixed(2)}`;

        const row = makeUiListEntry([entry.name, entry.subEntryCount, entry.startDelay, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function plugListData (entries) {
    const header = makeUiListHeader(['Name', 'Item Name', 'Animation Amount', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        if(entry.itemName === null) {
            entry.itemName = 'No Item';
        }

        const row = makeUiListEntry([entry.ending.name, entry.itemName, entry.animSet.length, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function poleListData (entries) {
    const header = makeUiListHeader(['Name', 'Width', 'Height', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        const row = makeUiListEntry([entry.ending.name, entry.width, entry.height, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function technoListData (entries) {
    const header = makeUiListHeader(['Name', 'Type', 'Target', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        if(entry.type === null) {
            entry.type = 'No Type';
        }

        if(entry.targetName === null) {
            entry.targetName = 'No Target Name';
        }

        const row = makeUiListEntry([entry.ending.name, entry.type, entry.targetName, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function tightRopeListData (entries) {
    const header = makeUiListHeader(['Name', 'Rope Type', 'Base 1 Position', 'Base 2 Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const positionBase1 = `X:${entry.coords[0][0].toFixed(2)} ` + `Y:${entry.coords[0][1].toFixed(2)} ` + `Z:${entry.coords[0][2].toFixed(2)}`;
        const positionBase2 = `X:${entry.coords[1][0].toFixed(2)} ` + `Y:${entry.coords[1][1].toFixed(2)} ` + `Z:${entry.coords[1][2].toFixed(2)}`;
        const ropeType = getDefaultRopeType(entry.ropeType);

        const row = makeUiListEntry([entry.name, ropeType, positionBase1, positionBase2], pos);

        row.children[1].style.color = getRopeColor(entry.ropeType);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}

export function tubeListData (entries) {
    const header = makeUiListHeader(['Name', 'Width', 'Height', 'Position']);

    const rows = [];
    let pos = 0;

    for(const entry of entries) {
        const position = `X:${entry.ending.coords[0].toFixed(2)} ` + `Y:${entry.ending.coords[1].toFixed(2)} ` + `Z:${entry.ending.coords[2].toFixed(2)}`;

        const row = makeUiListEntry([entry.ending.name, entry.width, entry.height, position], pos);

        rows.push(row);
        pos += 1;
    }

    return {
        header,
        rows
    };
}