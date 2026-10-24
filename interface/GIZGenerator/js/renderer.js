import { buildRegularObjectsLegacy, buildGizmoPickupLegacy, buildJsonDetails } from './html/types.js';
import { createObjectTree, setTreeMode } from "./html/tree.js";

const api = window.generatorAPI;

const objectTree = document.querySelector("#object-tree");
const dynamicContent = document.querySelector("#dynamic-content");
const modNameElement = document.querySelector(".mod-name");
const modeButtons = document.querySelectorAll(".tree-actions button");
const mainActionButton = document.querySelector(".bottom-actions .add-btn");
const loadButton = document.querySelector(".generator-topbar-actions .secondary-btn:first-child");
const generateButton = document.querySelector(".generator-topbar-actions .secondary-btn:nth-child(2)");
const saveButton = document.querySelector(".generator-topbar-actions .primary-btn");

let objectStructure = [];
let currentMode = "normal";
let selectedEntry = null;
let currentFormKind = null;
let currentFormData = null;

const gizmoPickups = [
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

const gizmoPickupSigs = [
    '73000000',
    '67000000',
    '62000000',
    '70000000',
    '50000000',
    '6a000000',
    '47000000',
    '68000000',
    '7a000000',
    '72000000',
    '69000000',
    '71000000',
    '76000000',
    '66000000',
    '65000000',
    '77000000',
    '78000000',
    '79000000',
    '64000000',
    '63000000',
    '6e000000',
    '6d000000',
    '61000000',
    '58000000'
];

//==========
// File tree
//==========

function renderTree() {
    objectTree.replaceChildren();

    const handlers = {
        onSelectEntry: selectEntry,
        onEditEntry: selectEntry,
        onEditFile: editFile,
        onDeleteEntry: deleteEntry,
        onDeleteFile: deleteFile,
        onAddEntry: startAddingEntry,
        onAddPath: startAddingPath
    };

    objectTree.appendChild(
        createObjectTree(objectStructure, handlers)
    );

    setTreeMode(objectTree, currentMode);
}

function selectEntry(selection) {
    selectedEntry = selection;
    loadEntryForm(selection);
}

function changeMode(mode) {
    currentMode = currentMode === mode ? "normal" : mode;

    setTreeMode(objectTree, currentMode);

    modeButtons.forEach(button => {
        const buttonMode = button.classList.contains("delete-btn") ? "delete" : button.classList.contains("edit-btn") ? "edit" : "add";

        const active = currentMode === buttonMode;

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}

modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const mode = button.classList.contains("delete-btn") ? "delete" : button.classList.contains("edit-btn") ? "edit" : "add";

        changeMode(mode);
    });
});

//=================
// Load entry form
//=================

async function loadEntryForm(selection) {
    const { fileIndex, category, index } = selection;

    try {
        const data = await api.getEditData((category === 'objects'), fileIndex, index);

        if(data.class === 'complex') {
            data.class = 'ComplexGizmo';
        }

        currentFormKind = category;
        currentFormData = data;

        const form = category === "coins" ? buildGizmoPickupLegacy() : buildRegularObjectsLegacy();

        dynamicContent.replaceChildren(form);

        populateForm(form, data);

        mainActionButton.textContent = "Save Object Changes";
    } catch (err) {
        console.log("Failed to load entry:", err);
    }
}

//===========
// Form data
//===========


function populateForm(form, data = {}) {
    const values = {
        name: data.name,
        id: data.type,
        gizmopickup: data.type,
        classlist: data.class,
        coords: data.pos,
        endline: data.endLine
    };

    form.querySelectorAll("[data-type]").forEach(block => {
        const type = block.dataset.type;
        const inputs = block.querySelectorAll("input, select");

        if (type === "rotation") {
            const rotations = [data.rotY, data.rotX];

            inputs.forEach((input, index) => {
                input.value = rotations[index] ?? "";
            });

            return;
        }

        const value = values[type];

        if (value === undefined || value === null) return;

        if (type === "coords") {
            const position = Array.isArray(value) ? value : [];

            inputs.forEach((input, index) => {
                input.value = position[index] ?? "";
            });

        } else if (type === "gizmopickup") {
            const pickupIndex = gizmoPickupSigs.indexOf(value);

            if (pickupIndex !== -1) {
                inputs[0].value = gizmoPickups[pickupIndex];
            }

        } else if (inputs.length > 0) {
            inputs[0].value = value;
        }
    });
}

function collectFormData() {
    const data = {};

    data.formType = (currentFormKind === 'objects' ? 'newObjects' : 'newCoins');

    const form = dynamicContent.firstElementChild;

    if (!form) return null;

    const requiredBlocks = form.querySelectorAll(".required-field, .required-box");

    for (const block of requiredBlocks) {
        const inputs = block.querySelectorAll("input, select");

        const invalid = [...inputs].some(input =>
            input.value.trim() === ""
        );

        if (invalid) {
            alert("Please fill in all mandatory fields.");
            return null;
        }
    }

    form.querySelectorAll("[data-type]").forEach(block => {
        const type = block.dataset.type;
        const inputs = [...block.querySelectorAll("input, select")];

        if (type === "coords") {
            data.pos = inputs.map(input => Number(input.value));

        } else if (type === "rotation") {
            if (inputs[0]?.value !== "") {
                data.rotY = Number(inputs[0].value);
            }

            if (inputs[1]?.value !== "") {
                data.rotX = Number(inputs[1].value);
            }

        } else if (inputs.length > 0) {
            const value = inputs[0].value;

            switch (type) {
                case "name":
                    data.name = value;
                    break;

                case "id":
                    data.type = value;
                    break;

                case "gizmopickup":
                    const pickupIndex = gizmoPickups.indexOf(value);
                    data.type = gizmoPickupSigs[pickupIndex];
                    break;

                case "classlist":
                    data.class = value;
                    break;

                case "endline":
                    data.endline = '00000000' + value + '00000000';
                    break;
            }
        }
    });

    return data;
}


function collectMainFormData() {
    const form = dynamicContent.firstElementChild;

    if (!form) return null;

    const pathInput = form.querySelector('[data-type="path"] input');
    const commentInput = form.querySelector('[data-type="comment"] input');

    const path = pathInput?.value.trim() ?? '';

    if (!path) {
        alert("Please enter a path.");
        return null;
    }

    const importsBlock = form.querySelector('[data-type="imports"]');

    const imports = importsBlock ? [...importsBlock.querySelectorAll(".string-list-row input")].map(input => input.value.trim()).filter(value => value !== "") : [];

    const checkPathsInput = form.querySelector('[data-type="checkPaths"] input[type="checkbox"]') ?? form.querySelector('input[name="checkPaths"]');

    const checkPaths = checkPathsInput?.checked ?? false;

    return {
        data: {
            path,
            com: commentInput?.value ?? "",
            imports
        },
        checkPaths
    };
}


//============
// Add / Edit
//============

let currentAction = "edit";
let currentFileIndex = null;

function startAddingEntry(category, fileIndex) {
    selectedEntry = null;
    currentFileIndex = fileIndex;
    currentFormKind = category;
    currentAction = "add";
    currentFormData = null;

    const form = category === "coins" ? buildGizmoPickupLegacy() : buildRegularObjectsLegacy();

    dynamicContent.replaceChildren(form);

    mainActionButton.textContent = category === "coins" ? "Add Coin" : "Add Object";
}


async function saveCurrentEntry() {
    if (
        currentAction === "add-path" ||
        currentAction === "edit-path"
    ) {
        await saveCurrentPath();
        return;
    }

    const data = collectFormData();

    if (!data) return;

    try {
        if (currentAction === "add") {
            await api.addObject(currentFileIndex, data, currentFormKind);
        } else {
            if (!selectedEntry) return;

            await api.editObject(selectedEntry.fileIndex, selectedEntry.index, data, selectedEntry.category);
        }

        await refreshTree();
        clearEditor();
    } catch (error) {
        console.error("Failed to save entry:", error);
    }
}

async function saveCurrentPath() {
    const result = collectMainFormData();

    const checkPaths = document.querySelector("#check-paths").checked;

    if (!result) return;

    const { data: formData } = result;

    const data = currentAction === "edit-path" ? { ...objectStructure[currentFileIndex], ...formData } : formData;

    try {
        if (currentAction === "add-path") {
            await api.addMain(data, checkPaths);
        } else {
            await api.updateMain(data, currentFileIndex, checkPaths);
        }

        await refreshTree();
        clearEditor();
    } catch (error) {
        console.error("Failed to save path:", error);
    }
}

async function editFile(fileIndex) {
    const file = objectStructure[fileIndex];

    if (!file) return;

    selectedEntry = null;
    currentFileIndex = fileIndex;
    currentFormKind = "path";
    currentAction = "edit-path";

    const form = buildJsonDetails(file);

    dynamicContent.replaceChildren(form);

    mainActionButton.textContent = "Save Path Changes";
}

function startAddingPath() {
    selectedEntry = null;
    currentFileIndex = null;
    currentFormKind = "path";
    currentAction = "add-path";

    const form = buildJsonDetails({
        path: "",
        comment: "",
        imports: []
    });

    dynamicContent.replaceChildren(form);

    mainActionButton.textContent = "Add Path";
}

async function deleteFile(fileIndex) {
    const file = objectStructure[fileIndex];

    if (!file) return;

    const confirmed = window.confirm(`Delete path "${file.path}" and its entries?`);

    if (!confirmed) return;

    try {
        await api.deleteMain(fileIndex);

        await refreshTree();
        clearEditor();
    } catch (error) {
        console.error("Failed to delete path:", error);
    }
}


async function deleteEntry(selection) {
    const confirmed = window.confirm("Are you sure you want to delete this entry?");

    if (!confirmed) return;

    try {
        await api.deleteObject(selection.fileIndex, selection.index, (selection.category === 'objects' ? 'newObjects' : 'newCoins'));

        await refreshTree();
        clearEditor();

    } catch (error) {
        console.error("Failed to delete entry:", error);
    }
}

function clearEditor() {
    dynamicContent.replaceChildren();

    selectedEntry = null;
    currentFileIndex = null;
    currentFormKind = null;
    currentFormData = null;
    currentAction = "edit";

    mainActionButton.textContent = "Add Object";
}

async function refreshTree() {
    objectStructure = await api.getObjectStructure();
    renderTree();
}

//=================
// Event Listeners
//=================

mainActionButton.addEventListener("click", saveCurrentEntry);

// Load Json
loadButton.addEventListener("click", async () => {
    await api.jsonByDialog();

    await refreshTree();

    modNameElement.textContent = await api.getModName();
    clearEditor();
});

// Generate Json / create output file
generateButton.addEventListener("click", async () => {
    await api.jsonNewFile();

    await refreshTree();

    modNameElement.textContent = await api.getModName();
    clearEditor();
});

// Save Changes To File
saveButton.addEventListener("click", async () => {
    await api.applyEdits();
});