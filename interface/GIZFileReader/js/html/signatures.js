export function getHeaderColor (headerName) {
    const headerColors = {
        RegularObjects:        '#5B9BD5',
        GizmoPickup:           '#f08c00',
        Pole:                  '#385881',
        Tube:                  '#12b886',
        Techno:                '#a63a0c',
        Ledge:                 '#15aabf',
        Ladder:                '#c2196b',
        Plug:                  '#2f8438',
        GizSwitch:             '#5739a6',
        TightRope:             '#ae3ec9',
        MiniCut:               '#d6336c',
        LightBeam:             '#c9d63f',
        Grapple:               '#a81717',
        GizHint:               '#5648ec',
        Door:                  '#32118f',
        GIZSIMPLEPROPOBJECT:   '#1ecf26',
        GizObstacle:           '#e6222c',
        GizSpellIt:            '#862e9c',
        Blowup:                '#fd6710',
        GizSuperBuild:         '#c42890',
        GizItem:               '#0c6c24',
        PushBlocks2:           '#36cfe8',
        ComplexGizmo:          '#f0ad00'
    };

    if(!Object.hasOwn(headerColors, headerName)) {
        return '#030303';
    }

    const color = headerColors[headerName];

    return color;
}

export function hasBeenImplemented (headerName) {
    switch (headerName) {
        case ('GizCutscene'):
            return false;
        case ('Teleport'):
            return false;
        case ('PushBlocks2'):
            return false;
        case ('Painting'):
            return false;
        case ('GizDig'):
            return false;
        case ('ComplexGizmo'):
            return false;
        case ('GizPuzzle'):
            return false;
        default:
            return true;
    }
}

export function getPickupType (typeNumber) {
    const signatures = {
        97: 'a - Effect 1, No Content',
        98: 'b - Blue Coin',
        99: 'c - Charkit, Token',
        100: 'd - Bell Pepper Emerald',
        101: 'e - Shield Piece BR',
        102: 'f - Small Brick Piece',
        103: 'g - Golden Coin',
        104: 'h - Heart',
        105: 'i - Ghost Coin',
        106: 'j - 2x4 Super Brick',
        109: 'm - MiniKit, Effect',
        110: 'n - Vehicle Token',
        112: 'p - Purple Coin',
        113: 'q - Parkour Token',
        114: 'r - Red Brick',
        115: 's - Silver Coin',
        118: 'v - Time Token',
        119: 'w - Shield Piece TL',
        120: 'x - Shield Piece TR',
        121: 'y - Shield Piece BL',
        122: 'z - Character/Vehicle Token',
        71: 'G - Golden Brick',
        80: 'P - 2x2 Super Brick',
        88: 'X - Effect, no content'
    };

    if(!Object.hasOwn(signatures, typeNumber)) return 'Unknown, default (silver coin)';

    return signatures[typeNumber];
}

export function getPickupColor (typeNumber) {
    const pickupColors = {
        97:  '#6c757d',  // Effect 1, No Content
        98:  '#1971c2',  // Blue Coin
        99:  '#f4f4f4',  // Charkit, Token
        100: '#2f9e44',  // Bell Pepper Emerald
        101: '#0c8599',  // Shield Piece TL
        102: '#c92a2a',  // Small Brick Piece
        103: '#e67700',  // Golden Coin
        104: '#e03131',  // Heart
        105: '#11d65d',  // Ghost Coin
        106: '#c41b8c',  // 2x4 Super Brick
        109: '#7950f2',  // MiniKit, Effect
        110: '#4263eb',  // Vehicle Token
        112: '#9c36b5',  // Purple Coin
        113: '#20c997',  // Parkour Token
        114: '#c92a2a',  // Red Brick
        115: '#868e96',  // Silver Coin
        118: '#c6c318',  // Time Token
        119: '#0c8599',  // Shield Piece TR
        120: '#0c8599',  // Shield Piece BL
        121: '#0c8599',  // Shield Piece BR
        122: '#4263eb',  // Character/Vehicle Token
        71:  '#e67700',  // Golden Brick
        80:  '#f32ee3',  // 2x2 Super Brick
        88:  '#6c757d'   // Effect, no content
    };

    if(!Object.hasOwn(pickupColors, typeNumber)) return '#868e96';

    return pickupColors[typeNumber];
}

export function getDefaultRopeType (typeNumber) {
    const signatures = {
        0: 'Brown Rope',
        1: 'Grey Rope',
        2: 'Green Rope',
        3: 'Vine',
        4: 'Chain',
        5: 'Whip',
        6: 'Snake',
        7: 'Gor Rope',
        8: 'Cable',
        9: 'Uv-Test Rope',
        10: 'Example Rope',
        11: 'Fire Hose'
    };

    if(!Object.hasOwn(signatures, typeNumber)) return 'Custum Rope Type';

    return signatures[typeNumber];
}

export function getRopeColor (typeNumber) {
    const ropeColors = {
        0:  '#8B5A2B', // Brown Rope
        1:  '#808080', // Grey Rope
        2:  '#3A8F3A', // Green Rope
        3:  '#4F8A3D', // Vine
        4:  '#A7A9AC', // Chain
        5:  '#B08A63', // Whip
        6:  '#5A7D3A', // Snake
        7:  '#B88652', // Gor Rope
        8:  '#303030', // Cable
        9:  '#7B61A8', // Uv-Test Rope
        10: '#A66B3F', // Example Rope
        11: '#fcfbfb'  // Fire Hose
    };

    if(!Object.hasOwn(ropeColors, typeNumber)) return '#030303';

    return ropeColors[typeNumber];
}