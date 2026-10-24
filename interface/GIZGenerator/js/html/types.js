import {
    createTextInput,
    createCoordinatesInput,
    createMultipleNumberBoxes,
    createSelectListInput,
    // createBoolBlockInput,
    createList
} from './components.js';

const regularObjectsSigs = [
    'GIZSIMPLEPROPOBJECT',
    'GizObstacle',
    'GizSpellIt',
    'ComplexGizmo',
    'GizItem',
    'Blowup',
    'GizSuperBuild',
    'GizSwitch',
    'PushBlocks2'
];

const regularObjectsColour = [
    '#1ecf26',
    '#e6222c',
    '#862e9c',
    '#f0ad00',
    '#0c6c24'
];

const gizmoPickupSigs = [
    'Silver Coin',
    'Golden Coin',
    'Blue Coin',
    'Purple Coin',
    '2x2 Super Brick',
    '2x4 Super Brick',
    'Golden Brick',
    'Heart',
    'Character/Vehicle Token',
    'Red Brick',
    'Ghost Coin',
    'Parkour Token',
    'Time Token',
    'Small Brick Piece',
    'Shield Piece TL',
    'Shield Piece TR',
    'Shield Piece BL',
    'Shield Piece BR',
    'Bell Pepper Emerald',
    'Charkit, Token',
    'Some Token',
    'MiniKit, Effect',
    'Effect, no content',
    'Effect 1, No Content'
];

const pickupColours = [
    '#868e96',  // Silver coin
    '#e67700',  // Golden Coin
    '#1971c2',  // Blue Coin
    '#9c36b5',  // Purple Coin
    '#f32ee3',  // 2x2 Super Brick
    '#c41b8c',  // 2x4 Super Brick
    '#e67700',  // Golden Brick
    '#e03131',  // Heart
    '#4263eb',  // Character/Vehicle Token
    '#c92a2a',  // Red Brick
    '#11d65d',  // Ghost Coin
    '#20c997',  // Parkour Token
    '#c6c318',  // Time Token
    '#c92a2a',  // Small Brick Piece
    '#0c8599',  // Shield Piece TL
    '#0c8599',  // Shield Piece TR
    '#0c8599',  // Shield Piece BL
    '#0c8599',  // Shield Piece BR
    '#2f9e44',  // Bell Pepper Emerald
    '#0edbc0',  // Charkit, Token
    '#4263eb',  // Some Token
    '#7950f2',  // MiniKit, Effect
    '#6c757d',   // Effect, no content
    '#6c757d'  // Effect 1, No Content
];

//============================
// Legacy map-manager support
//============================

export function buildJsonDetails(values = {}) {
    const block = document.createElement("div");
    block.className = "jsondetails";

    block.innerHTML = `
        <div class="section-general">
            <div class="section-header"</div>
            <div class="section content"></div>
        </div>
    `;

    const generalContent = block.querySelector(".section-general");

    generalContent.append(
        createTextInput("Path", "LEVELS/LEGO_CITY/LEGO_CITY/...", true, "path"),
        createTextInput("Comment", "Some comment for future devs", false, "comment"),
        createList("Imports", values.imports ?? [], "imports")
    );

    const pathInput = block.querySelector('[data-type="path"] input');
    const commentInput = block.querySelector('[data-type="comment"] input');

    if (pathInput) pathInput.value = values.path ?? "";
    if (commentInput) commentInput.value = values.com ?? "";

    return block;
}


export function buildRegularObjectsLegacy () {
    const block = document.createElement('div');
    block.className = 'regularObjectLegacy';

    block.innerHTML = `
        <div class="section-general">
            <div class="section-header"</div>
            <div class="section content"</div>
        </div>
    `;

    const generalContent = block.querySelector(".section-general");

    generalContent.append(
        createTextInput('Name', 'Typ name string...', true, 'name'),
        createTextInput('Object ID', 'Typ id string...', true, 'id'),
        createSelectListInput('Class', regularObjectsSigs, null, true, 'classlist'),
        createCoordinatesInput('Position', true, 'coords'),
        createMultipleNumberBoxes([ 'Rotation Y', 'Rotation X' ], false, 'rotation'),
        createTextInput('Endline', "Endline is not always needed! Example for ComplexGizmo: 0000000000000e00000006000000000000000000", false, 'endline')
    );

    return block;
}

export function buildGizmoPickupLegacy () {
    const block = document.createElement('div');
    block.className = 'gizmopickupLegacy';

    block.innerHTML = `
        <div class="section-general">
            <div class="section-header"</div>
            <div class="section content"</div>
        </div>
    `;

    const generalContent = block.querySelector(".section-general");

    generalContent.append(
        createTextInput('Name', 'Typ name string...', true, 'name'),
        createSelectListInput('Type', gizmoPickupSigs, pickupColours, true, 'gizmopickup'),
        createCoordinatesInput('Position', true, 'coords')
    );

    return block;
}