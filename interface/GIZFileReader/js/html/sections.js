import {
    createDataBlock,
    createVectorBlock,
    createListBlock,
    createBooleanArray,
    arrayString,
    createAnimSetArray,
    getDivider,
    createMiniCutSubEntryBlock,
    createDoorObjectArray,
    cityBricksArray
} from "./components.js";

import {
    getPickupType,
    getDefaultRopeType,
    getHeaderColor,
    getPickupColor,
    getRopeColor
} from './signatures.js';

//=================
// Regular objects
//=================

export function createRegularBlock (values) {
    const block = document.createElement("div");
    block.className = "regular-objects-block";

    block.innerHTML =  `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="section-content general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="endline-block">
            <div class="section-header">Endline</div>
            <div class="endline-content"></div>
        </div>
    `;

    const generalContent = block.querySelector(".general-content");
    const connectedGroup = block.querySelector(".connected-group");
    const endlineContent = block.querySelector(".endline-content");

    const classElement = createDataBlock("Class", values.className, "className");

    classElement.querySelector(".data-value").style.color = getHeaderColor(values.className);

    generalContent.append(
        createDataBlock("Name", values.name, "string"),
        createDataBlock("ID", values.id, "string"),
        classElement
    );

    if(Object.hasOwn(values, "attachedName1") && values.attachedName1 !== null){
        generalContent.append(
            createDataBlock("Attached Name 1", values.attachedName1, 'string')
        );
    }

    if(Object.hasOwn(values, "attachedName2") && values.attachedName2 !== null) {
        generalContent.append(
            createDataBlock("Attached Name 2", values.attachedName2, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock("Position", values.coords, ["X", "Y", "Z"], 'coords'),
        createDataBlock("Rotation Y", (values.rotY * 360 / 65535).toFixed(3) + '°', "rotation"),
        createDataBlock("Rotation X", (values.rotX * 360 / 65535).toFixed(3) + '°', "rotation")
    );

    endlineContent.append(
        createDataBlock("Endline", values.endline, "endline")
    );

    return block;
}

//====================
// GizmoPickup header
//====================

export function createGizmoPickupHeaderBlock (values) {
    const block = document.createElement('div');
    block.className = "gizmo-pickup-header-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Pickup Header</div>
            <div class="general-content"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const content = block.querySelector('.general-content');
    const vars = block.querySelector('.extra-variables');

    content.append(
        createDataBlock('Scale', values.Scale, 'float'),
        createDataBlock('Draw Distance', values.drawDistance, 'float')
    );

    vars.append(
        createDataBlock('Unsigned Int', values.uint, 'uint'),
        createListBlock('Floats', values.floats, 'float')
    );

    return block;
}

//===================
// GizmoPickup entry
//===================

export function createGizmoPickupEntryBlock (values) {
    const block = document.createElement("div");
    block.className = "gizmo-pickup-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector(".general-content");
    const connectedGroup = block.querySelector(".connected-group");
    const extraVars = block.querySelector(".extra-variables");

    const pickupType = getPickupType(values.typeSig);

    const pickupTypeBlock = createDataBlock('Pickup Type', pickupType, 'string');
    pickupTypeBlock.querySelector(".data-value").style.color = getPickupColor(values.typeSig);

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string'),
        pickupTypeBlock,
        createDataBlock('Respawn Distance', values.respawnDistance, 'float'),
    );
    
    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'connected-string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }
    extraVars.append(
        createDataBlock('Char', values.char, 'char'),
        createDataBlock('Short', values.short, 'short'),
        createDataBlock('Unsigned Short', values.Ushort, 'ushort')
    );

    return block;
}

//======
// Pole
//======

export function createPoleBlock (values) {
    const block = document.createElement("div");
    block.className = "pole-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector(".general-content");
    const connectedGroup = block.querySelector(".connected-group");
    const extraVars = block.querySelector(".extra-variables");

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string'),
        createDataBlock('Height', values.height, 'float'),
        createDataBlock('Width', values.width, 'float')
    );

    if(values.specialName !== null) {
        generalContent.append(
            createDataBlock('Special name', values.specialname, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords'),
    )

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'connected-string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    extraVars.append(
        createDataBlock('Unsigned Short', values.Ushort, 'ushort'),
        createListBlock('Chars', values.chars, 'char'),
        createListBlock('Floats', values.floats, 'float')
    );

    return block;
}

//======
// Tube
//======

export function createTubeBlock (values) {
    const block = document.createElement("div");
    block.className = "tube-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string'),
        createDataBlock('Height', values.height, 'float'),
        createDataBlock('Width', values.width, 'float')
    );

    if(values.specialName !== null) {
        extraVars.append(
            createDataBlock('Special name', values.specialName, 'string')
        );
    }

    if(values.actionBlockName !== null) {
        extraVars.append(
            createDataBlock('Action Name', values.actionBlockName, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    extraVars.append(
        createBooleanArray('Bools', values.booleans),
        createListBlock('Shorts', values.shorts, 'short'),
        createListBlock('Floats', values.floats, 'float'),
        createListBlock('Bits', values.bits, 'bits')
    );

    return block;
}

//========
// Techno
//========

export function createTechnoBlock (values) {
    const block = document.createElement("div");
    block.className = "techno-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string')
    )

    if(values.type !== null) {
        generalContent.append(
            createDataBlock('Techno Type', values.type, 'string')
        );
    }

    if(values.targetName !== null) {
        generalContent.append(
            createDataBlock('Target Object Name', values.targetName, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    extraVars.append(
        createDataBlock('Short', values.short, 'short'),
        createListBlock('Uchars', values.Uchars, 'uchar'),
        createListBlock('Ints', values.ints, 'int'),
        createListBlock('Floats', values.floats, 'float')
    );

    return block;
}

export function createLedgeBlock (values) {
    const block = document.createElement("div");
    block.className = "ledge-block";
    
    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    // const pickupType = getLedgeType(values.typeSig); Make when i know what all ledges are.

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string'),
        createDataBlock('Type', values.typeSig, 'string')
    );

    if(values.connectedEntries[0] !== null) {
        generalContent.append(
            createDataBlock('Connected Name Left', values.connectedEntries[0], 'string')
        );
    }

    if(values.connectedEntries[1] !== null) {
        generalContent.append(
            createDataBlock('Connected Name Right', values.connectedEntries[1], 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords'),
        createDataBlock('Rotation Y', (values.rotation[0] * 360 / 65535).toFixed(3) + '°', 'rotation')
    );

    if(values.rotation[1] !== null) {
        connectedGroup.append(
            createDataBlock('Rotation X', (values.rotation[1] * 360 / 65535).toFixed(3) + '°', 'rotation')
        );
    }

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    extraVars.append(
        createDataBlock('Short', values.short, 'short')
    );

    if(values.ushort !== null) {
        extraVars.append(
            createDataBlock('Unsigned Short', values.ushort, 'ushort')
        );
    }

    return block;
}

export function createLadderBlock (values) {
    const block = document.createElement("div");
    block.className = "ladder-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string'),
        createDataBlock('Type', values.type, 'string'),
        createDataBlock('Height', values.height, 'float')
    );

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords'),
        createDataBlock('Rotation Y', (values.rotationY * 360 / 65535).toFixed(3) + '°', 'rotation')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }
    
    extraVars.append(
        createListBlock('Chars', values.chars, 'char')
    );

    return block;
}

export function createPlugBlock (values) {
    const block = document.createElement("div");
    block.className = "ladder-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string')
    );

    if(values.itemName !== null) {
        generalContent.append(
            createDataBlock('Item Name', values.itemName, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    if(values.animSet.length !== 0) {
        extraVars.append(
            createAnimSetArray('Animation Set', values.animSet)
        );
    }

    extraVars.append(
        createDataBlock('Unsigned Char', values.Uchar, 'uchar'),
        createDataBlock('Unsigned Int', values.Uint, 'uint'),
        createListBlock('Bits', values.bits, 'bits'),
        createListBlock('Float', values.float, 'float'),
        createListBlock('Ushort', values.Ushorts, 'ushort')
    );

    return block;
}

export function createGizSwitchBlock(values) {
    const block = document.createElement("div");
    block.className = "gizswitch-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string')
    );

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    if(values.actionNames[0] !== null || values.actionNames[1] !== null || values.actionNames[2] !== null) {
        extraVars.append(
            createListBlock('Action Names', values.actionNames, 'string')
        );
    }

    if(values.sounds[0] !== null || values.sounds[0] !== null) {
        extraVars.append(
            createListBlock('Sounds', values.sounds, 'string')
        );
    }

    if(values.extraName !== null) {
        extraVars.append(
            createDataBlock('Extra Name', values.extraName, 'string')
        );
    }

    if(values.animset.length !== 0) {
        extraVars.append(
            createAnimSetArray('Animation Set', values.animset)
        );
    }

    extraVars.append(
        createDataBlock('Uint', values.Uint, 'uint'),
        createListBlock('Short', values.shorts, 'short'),
        createListBlock('Uchar', values.Uchars, 'uchar'),
        createListBlock('Float', values.floats, 'float')
    );

    return block;
}

export function createTightRopeBlock (values) {
    const block = document.createElement("div");
    block.className = "tightrope-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    const ropeType = getDefaultRopeType(values.ropeType);

    const typeBlock = createDataBlock('Rope Type', ropeType, 'string');

    typeBlock.querySelector('.data-value').style.color = getRopeColor(values.ropeType);

    generalContent.append(
        createDataBlock('Name', values.name, 'string'),
        typeBlock,
        createBooleanArray('Bools', values.booleans)
    );

    connectedGroup.append(
        createVectorBlock('Base 1 Position', values.coords[0], ["X", "Y", "Z"], 'coords'),
        createDataBlock('Rotation Y', (values.rotation1[1] * 360 / 65535).toFixed(3) + '°', 'rotation'),
        createDataBlock('Rotation X', (values.rotation1[0] * 360 / 65535).toFixed(3) + '°', 'rotation'),

        createVectorBlock('Base 2 Position', values.coords[1], ["X", "Y", "Z"], 'coords'),
        createDataBlock('Rotation Y', (values.rotation2[1] * 360 / 65535).toFixed(3) + '°', 'rotation'),
        createDataBlock('Rotation X', (values.rotation2[0] * 360 / 65535).toFixed(3) + '°', 'rotation'),
    );

    extraVars.append(
        createVectorBlock('Coordinates 3', values.coords[2], ["X", "Y", "Z"], 'coords'),
        createVectorBlock('Coordinates 4', values.coords[3], ["X", "Y", "Z"], 'coords'),
        createDataBlock('Char', values.char, 'char'),
        createListBlock('Ushort', values.ushorts, 'ushort'),
        createListBlock('Uchar', values.uchars, 'uchar')
    );

    return block
}

export function createMiniCutBlock (values) {
    const block = document.createElement("div");
    block.className = "minicut-header-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>

        <div class="section subentries">
            <div class="section-header">Sub Entries</div>
            <div class="sub-entries"></div>
        </div>
    `

    const general = block.querySelector('.general-content');
    const extraVars = block.querySelector('.extra-variables');
    const subEntries = block.querySelector('.sub-entries');

    general.append(
        createDataBlock('Name', values.name, 'string'),
        createDataBlock('Start Delay', values.startDelay, 'float'),
        createDataBlock('Initial Transition Slowdown', values.initialSlowdown, 'float'),
    );

    if(values.uchar !== null) {
        extraVars.append(
            createDataBlock('Uchar', values.uchar, 'char')
        );
    }

    extraVars.append(
        createDataBlock('Char', values.char, 'char'),
        createListBlock('Floats', values.floats, 'float')
    );

    for(const subEntry of values.subentries) {
        subEntries.append(
            createMiniCutSubEntryBlock(subEntry),
            getDivider()
        );
    }
    
    return block;
}

export function createLightBeamBlock (values) {
    const block = document.createElement("div");
    block.className = "tightrope-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string')
    );

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    if(values.uchar !== null) {
        extraVars.append(
            createDataBlock('Uchar', values.uchar, 'uchar')
        );
    }

    extraVars.append(
        createDataBlock('Bits', values.bits, 'bit'),
        createListBlock('Floats', values.floats, 'float'),
        createListBlock('Shorts', values.shorts, 'short')
    );

    return block;
}

export function createGrappleBlock (values) {
    const block = document.createElement("div");
    block.className = "tightrope-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.name, 'string')
    )

    if(values.someName !== null) {
        generalContent.append(
            createDataBlock('Some Name', values.someName, 'string')
        );
    }

    if(values.specialName !== null) {
        generalContent.append(
            createDataBlock('Special Name', values.specialName, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    extraVars.append(
        arrayString('Bits String', values.bits),
        createListBlock('Uchars', values.uchars, 'uchar'),
        createListBlock('Ushorts', values.ushorts, 'ushort'),
        createListBlock('Floats', values.floats, 'float')
    );

    return block;
}

export function createGizHintBlock (values) {
    const block = document.createElement("div");
    block.className = "tightrope-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string'),
        createDataBlock('Hint Name', values.hintName, 'string')
    );

    if(values.specialName !== null) {
        generalContent.append(
            createDataBlock('Special Name', values.specialName, 'string')
        );
    }

    if(values.extraNames[0] !== null || values.extraNames[1] !== null) {
        generalContent.append(
            createListBlock('Extra Names', values.extraNames, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    extraVars.append(
        createVectorBlock('Some Position 1', values.NuVecs[0], ["X", "Y", "Z"], 'coords'),
        createVectorBlock('Some Position 2', values.NuVecs[1], ["X", "Y", "Z"], 'coords'),
        createDataBlock('Uint', values.uint, 'uint'),
        createListBlock('Ints', values.ints, 'int'),
        createListBlock('Floats', values.floats, 'float'),
        createListBlock('Bits', values.bits, 'bit')
    );

    return block;
}

export function createDoorBlock (values) {
    const block = document.createElement("div");
    block.className = "door-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string'),
        createDataBlock('Destination', values.dest, 'string'),
        createDataBlock('Cutscene Name', values.cutScene, 'string'),
        arrayString('Special String 1', values.specialStrings[0], true),
        arrayString('Special String 2', values.specialStrings[1], true)
    );

    if(values.extraNames.length !== 0) {
        generalContent.append(
            createListBlock('Extra Names', values.extraNames, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    extraVars.append(
        createVectorBlock('Some Position', values.NuVec, ["X", "Y", "Z"], 'coords')
    );

    if(values.arrays.length !== 0) {
        extraVars.append(
            createDoorObjectArray('Some Arrays', values.arrays)
        );
    }

    extraVars.append(
        createDataBlock('Int', values.int, 'int'),
        createListBlock('Chars', values.chars, 'char'),
        createListBlock('Floats', values.floats, 'float'),
        createListBlock('Shorts', values.shorts, 'short')
    );

    return block;
}

export function createGIZSIMPLEPROPOBJECTBlock (values) {
    const block = document.createElement("div");
    block.className = "gizsimplepropobject-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.name, 'string')
    )

    if(values.particles[0] !== null || values.particles[1] !== null || values.particles[2] !== null) {
        generalContent.append(
            createListBlock('Particles', values.particles, 'string')
        );
    }

    if(values.sounds[0] !== null || values.sounds[1] !== null || values.sounds[2] !== null) {
        generalContent.append(
            createListBlock('Sounds', values.sounds, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    if(values.animSet.length !== 0) {
        extraVars.append(
            createAnimSetArray('Animations', values.animSet)
        );
    }

    if(values.cityBricks.length !== 0) {
        extraVars.append(
            cityBricksArray('City Bricks', values.cityBricks)
        );
    }

    extraVars.append(
        createVectorBlock('Floats 1', values.NuVecs[0], ["Float 1", "Float 2", "Float 3"], 'float'),
        createVectorBlock('Floats 2', values.NuVecs[1], ["Float 1", "Float 2", "Float 3"], 'float'),
        createVectorBlock('Floats 3', values.NuVecs[2], ["Float 1", "Float 2", "Float 3"], 'float'),
        createBooleanArray('Bits', values.bits, 'bit'),
        createDataBlock('Float', values.float, 'float'),
        createDataBlock('Char', values.char, 'char'),
        createListBlock('Uchars', values.uchar, 'uchar'),
        createListBlock('Shorts', values.shorts, 'short'),
        createListBlock('Ints', values.int, 'int'),
        createListBlock('Uints', values.uint, 'uint')
    );

    return block;
}

export function createGizObstacleBlock (values) {
    const block = document.createElement("div");
    block.className = "gizsimplepropobject-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name)
    );

    if(values.soundIdNames[0] !== null || values.soundIdNames[1] !== null) {
        generalContent.append(
            createListBlock('Sounds', values.sounds, 'string')
        );
    }

    if(values.linkedName !== null) {
        generalContent.append(
            createDataBlock('Linked Name', values.linkedName, 'string')
        );
    }

    if(values.specialSystemName !== null) {
        generalContent.append(
            createDataBlock('Specialsystem Name', values.specialSystemName, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    if(values.unkownName !== null) {
        extraVars.append(
            createDataBlock('Some Name', values.unkownName, 'string')
        );
    }

    if(values.gameAnimSet.length !== 0) {
        extraVars.append(
            createAnimSetArray('Animation Set', values.gameAnimSet)
        );
    }

    extraVars.append(
        createVectorBlock('Some Position', values.NuVecs[0], ["X", "Y", "Z"], 'position'),
        createVectorBlock('Floats 1', values.NuVecs[1], ["Float 1", "Float 2", "Float 3"], 'float'),
        createVectorBlock('Floats 2', values.NuVecs[2], ["Float 1", "Float 2", "Float 3"], 'float')
    );

    extraVars.append(
        createListBlock('Ints', values.ints, 'int'),
        createListBlock('Chars', values.chars, 'char'),
        createListBlock('Shorts', values.shorts, 'short'),
        createListBlock('Floats', values.floats, 'float')
    );

    return block;
}

export function createGizSpellItBlock (values) {
    const block = document.createElement("div");
    block.className = "gizspellit-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.ending.name, 'string')
    );

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    extraVars.append(
        createVectorBlock('Some Position 1', values.NuVecs[0], ["X", "Y", "Z"], 'position'),
        createVectorBlock('Some Position 2', values.NuVecs[1], ["X", "Y", "Z"], 'position'),
        createVectorBlock('Some Position 3', values.NuVecs[2], ["X", "Y", "Z"], 'position'),
        createVectorBlock('Some Position 4', values.NuVecs[3], ["X", "Y", "Z"], 'position'),
        createVectorBlock('Floats', values.NuVecs[4], ["Float 1", "Float 2", "Float 3"], 'float')
    );

    if(values.animSet.length !== 0) {
        extraVars.append(
            createAnimSetArray('Animations', values.animSet)
        );
    }

    extraVars.append(
        createListBlock('Uints', values.uints, 'uint'),
        createListBlock('Chars', values.chars, 'char'),
        createListBlock('Shorts', values.shorts, 'short'),
        createListBlock('Floats', values.floats, 'float')
    );

    return block;
}

export function createBlowupBlock (values) {
    const block = document.createElement("div");
    block.className = "blowup-block";

    block.innerHTML = `
        <div class="section general">
            <div class="section-header">Main Information</div>
            <div class="general-content"></div>
        </div>

        <div class="section connected">
            <div class="section-header">Location</div>
            <div class="connected-group"></div>
        </div>

        <div class="section extra">
            <div class="section-header">Extra Data</div>
            <div class="extra-variables"></div>
        </div>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    generalContent.append(
        createDataBlock('Name', values.name, 'string')
    );

    if(values.particles[0] !== null || values.particles[1] !== null || values.particles[2] !== null) {
        generalContent.append(
            createListBlock('Particles', values.particles, 'string')
        );
    }

    if(values.effects[0] !== null || values.effects[1] !== null || values.effects[2] !== null || values.effects[3] !== null) {
        generalContent.append(
            createListBlock('Effects', values.effects, 'string')
        );
    }

    if(values.sounds[0] !== null || values.sounds[1] !== null || values.sounds[2] !== null) {
        generalContent.append(
            createListBlock('Sounds', values.sounds, 'string')
        );
    }

    if(values.legoSpecial !== null) {
        generalContent.append(
            createDataBlock('Lego Special', values.legoSpecial, 'string')
        );
    }

    connectedGroup.append(
        createVectorBlock('Position', values.ending.coords, ["X", "Y", "Z"], 'coords')
    );

    if(values.ending.attached !== null) {
        connectedGroup.append(
            createDataBlock('Attached Name', values.ending.attached.name, 'string'),
            createVectorBlock('Attached Position', values.ending.attached.coords, ["X", "Y", "Z"], 'coords')
        );
    }

    if(values.cityBricks.length !== 0) {
        extraVars.append(
            cityBricksArray('City Bricks', values.cityBricks)
        );
    }

    extraVars.append(
        createVectorBlock('Floats 1', values.NuVecs[0], ["Float 1", "Float 2", "Float 3"], 'float'),
        createVectorBlock('Floats 2', values.NuVecs[1], ["Float 1", "Float 2", "Float 3"], 'float'),
        createDataBlock('Int', values.int, 'int'),
        createDataBlock('Bits', values.bits, 'bit'),
        createListBlock('Uints', values.uints, 'uint'),
        createListBlock('Shorts', values.shorts, 'short'),
        createBooleanArray('Booleans', values.bools),
        createListBlock('Floats', values.floats, 'float')
    );

    return block;
}