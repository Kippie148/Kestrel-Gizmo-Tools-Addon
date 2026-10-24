//=========
// Imports
//=========

import {
    createRegularBlock, 
    createGizmoPickupHeaderBlock, 
    createGizmoPickupEntryBlock, 
    createPoleBlock, 
    createTubeBlock,
    createTechnoBlock,
    createLedgeBlock,
    createLadderBlock,
    createPlugBlock,
    createGizSwitchBlock,
    createTightRopeBlock,
    createMiniCutBlock,
    createLightBeamBlock,
    createGrappleBlock,
    createGizHintBlock,
    createDoorBlock,
    createGIZSIMPLEPROPOBJECTBlock,
    createGizObstacleBlock,
    createGizSpellItBlock,
    createBlowupBlock
} from './sections.js';

import {
    regularObjectListData,
    blowupListData,
    doorListData,
    gizHintListData,
    gizmoPickupListData,
    gizObstacleListData,
    GIZSIMPLEPROPOBJECTListData,
    gizSpellItListData,
    gizSwitchListData,
    grappleListData,
    ladderListData,
    ledgeListData,
    lightBeamListData,
    miniCutListData,
    plugListData,
    poleListData,
    technoListData,
    tightRopeListData,
    tubeListData
} from './List-contents.js';

//===================
// Control Functions
//===================

export function getListUi (headerName, entries) {
    let result;

    switch(headerName) {
        case 'RegularObjects':
            result = regularObjectListData(entries);
            break;
        case 'GizmoPickup':
            result = gizmoPickupListData(entries);
            break;
        case 'Pole':
            result = poleListData(entries);
            break;
        case 'Tube':
            result = tubeListData(entries);
            break;
        case 'Techno':
            result = technoListData(entries);
            break;
        case 'Ledge':
            result = ledgeListData(entries);
            break;
        case 'Ladder':
            result = ladderListData(entries);
            break;
        case 'Plug':
            result = plugListData(entries);
            break;
        case 'GizSwitch':
            result = gizSwitchListData(entries);
            break;
        case 'TightRope':
            result = tightRopeListData(entries);
            break;
        case 'MiniCut':
            result = miniCutListData(entries);
            break;
        case 'LightBeam':
            result = lightBeamListData(entries);
            break;
        case 'Grapple':
            result = grappleListData(entries);
            break;
        case 'GizHint':
            result = gizHintListData(entries);
            break;
        case 'Door':
            result = doorListData(entries);
            break;
        case 'GIZSIMPLEPROPOBJECT':
            result = GIZSIMPLEPROPOBJECTListData(entries);
            break;
        case 'GizObstacle':
            result = gizObstacleListData(entries);
            break;
        case 'GizSpellIt':
            result = gizSpellItListData(entries);
            break;
        case 'Blowup':
            result = blowupListData(entries);
            break;
        default:
            result = null;
    }

    return result;
}

export function getDetailsUI (headerName, entry) {
    let result;

    switch(headerName) {
        case 'RegularObjects':
            result = createRegularBlock(entry);
            break;
        case 'GizmoPickupHeader':
            result = createGizmoPickupHeaderBlock(entry);
            break;
        case 'GizmoPickupEntry':
            result = createGizmoPickupEntryBlock(entry);
            break;
        case 'Pole':
            result = createPoleBlock(entry);
            break;
        case 'Tube':
            result = createTubeBlock(entry);
            break;
        case 'Techno':
            result = createTechnoBlock(entry);
            break;
        case 'Ledge':
            result = createLedgeBlock(entry);
            break;
        case 'Ladder':
            result = createLadderBlock(entry);
            break;
        case 'Plug':
            result = createPlugBlock(entry);
            break;
        case 'GizSwitch':
            result = createGizSwitchBlock(entry);
            break;
        case 'TightRope':
            result = createTightRopeBlock(entry);
            break;
        case 'MiniCut':
            result = createMiniCutBlock(entry);
            break;
        case 'LightBeam':
            result = createLightBeamBlock(entry);
            break;
        case 'Grapple':
            result = createGrappleBlock(entry);
            break;
        case 'GizHint':
            result = createGizHintBlock(entry);
            break;
        case 'Door':
            result = createDoorBlock(entry);
            break;
        case 'GIZSIMPLEPROPOBJECT':
            result = createGIZSIMPLEPROPOBJECTBlock(entry);
            break;
        case 'GizObstacle':
            result = createGizObstacleBlock(entry);
            break;
        case 'GizSpellIt':
            result = createGizSpellItBlock(entry);
            break;
        case 'Blowup':
            result = createBlowupBlock(entry);
            break;
        default:
            result = null;
    }

    return result;
}