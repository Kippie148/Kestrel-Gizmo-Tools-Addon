//=========
// Imports
//=========

import {
    getListUi,
    getDetailsUI
} from './html/dynamic-ui-control.js';

import {
    getHeaderColor,
    hasBeenImplemented
} from './html/signatures.js';

//=========
// DOM
//=========

// Main UI
const searchInput = document.getElementById('input-search');
const btnLoadFile = document.getElementById('btn-load-file');

const objectCountEl = document.getElementById('object-count');
const tableHeaderEl = document.getElementById('table-header');
const objectListEl = document.getElementById('object-list');

const fileAccessList = document.getElementById('file-access-list');
const btnAllFiles = document.getElementById('btn-all-files');
const sectionSelectorButton = document.getElementById('section-selector-button');
const sectionSelectorMenu = document.getElementById('section-selector-menu');
const sectionSelectorName = document.getElementById('section-selector-name');
const sectionSelectorCount = document.getElementById('section-selector-count');
const detailsContent = document.getElementById('details-content');


// Modal
const knownFilesModal = document.getElementById('knownFilesModal');
const closeModalBtn = document.getElementById('closeKnownFilesModal');
const knownFilesListEl = document.getElementById('knownFilesList');
const knownFilesSearchEl = document.getElementById('knownFilesSearch');
const autoGameScanBtn = document.getElementById('autoGameScanBtn');
const manualFolderScanBtn = document.getElementById('manualFolderScanBtn');


//===========
// Variables
//===========

let currentHeader = 0;
let selectedIndex = 0;

let currentEntries = [];

let visibleIndices = [];

let knownFilesAll = [];
let knownFilesFiltered = [];

//====================
// Reload Current File
//====================

async function reloadCurrentFile() {
    currentHeader = 0;
    selectedIndex = 0;

    currentEntries = [];
    visibleIndices = [];

    loadHeaderMenu();

    renderObjectList();

    await renderQuickAccess();

    await renderDetails()

    const entries = await window.readerAPI.getEntryData(currentHeader);

    if (entries.length > 0) {
        renderDetails();
    } else {
        detailsContent.replaceChildren();
    }
}


//====================
// Header Menu
//====================

async function loadHeaderMenu() {
    const sections = await window.readerAPI.getAllHeaders();

    sectionSelectorMenu.replaceChildren();

    sections.forEach((section, index) => {
        const option = document.createElement('button');

        option.className = 'section-selector-option';
        option.type = 'button';
        option.dataset.index = index;

        option.innerHTML = `
            <span class="section-selector-option-name">
                ${section.name}
            </span>

            <span class="section-selector-option-count">
                ${section.entryCount} Objects
            </span>
        `;

        const nameElement = option.querySelector('.section-selector-option-name');

        nameElement.style.color = getHeaderColor(section.name);

        sectionSelectorMenu.appendChild(option);
    });

    await updateSectionSelector();
}

async function updateSectionSelector() {
    const sections = await window.readerAPI.getAllHeaders();
    const section = sections[currentHeader];

    if (!section) {
        sectionSelectorName.textContent = 'Gizmo header';
        sectionSelectorCount.textContent = '0 Objects';
        sectionSelectorName.style.color = '#667085';
        return;
    }

    sectionSelectorName.textContent = section.name;
    sectionSelectorCount.textContent = `${section.entryCount} Objects`;

    sectionSelectorName.style.color = getHeaderColor(section.name);

    sectionSelectorMenu.querySelectorAll('.section-selector-option')
        .forEach((option, index) => {
            option.classList.toggle('active', index === currentHeader);
        });
}

//====================
// Render Object List
//====================

let position = 0;

async function renderObjectList(entries = null, indices = null) {
    const headerName = await window.readerAPI.getHeaderName(currentHeader);

    if (entries === null) {
        entries = await window.readerAPI.getEntryData(currentHeader);

        indices = entries.map((_, index) => index);
    }

    currentEntries = entries;
    visibleIndices = indices;

    const list = getListUi(headerName, currentEntries);

    tableHeaderEl.replaceChildren(list.header);

    const fragment = document.createDocumentFragment();

    for (const row of list.rows) {
        fragment.appendChild(row);
    }

    objectListEl.replaceChildren(fragment);

    const sections = await window.readerAPI.getAllHeaders();

    let objects = 0;

    sections.forEach((section) => {
        objects += section.entryCount;
    });

    objectCountEl.textContent = `Total ${objects} objects`;

    await updateSectionSelector();
}

//===================
// Render Details UI
//===================

async function renderDetails() {
    const originalIndex = visibleIndices[selectedIndex];

        if (originalIndex === undefined) {
        detailsContent.replaceChildren();
        return;
    }

    let headerName = await window.readerAPI.getHeaderName(currentHeader);

    if(headerName === 'GizmoPickup' && selectedIndex === 0) {
        headerName = 'GizmoPickupHeader';
    } else if (headerName === 'GizmoPickup' && selectedIndex !== 0) {
        headerName = 'GizmoPickupEntry';
    }

    const entryData = await window.readerAPI.getEntryData(currentHeader, originalIndex);

    const uiData = getDetailsUI(headerName, entryData);

    detailsContent.replaceChildren(uiData);
}

//===================
// Selecting Objects
//===================

function selectObject(index) {
    selectedIndex = index;

    objectListEl.querySelectorAll('.object-row').forEach(row => {
        row.classList.toggle('active', Number(row.dataset.index) === selectedIndex);
    });

    renderDetails();
}


//====================
// Section Selection
//====================

async function selectHeader(index) {
    const sections = await window.readerAPI.getAllHeaders();

    if (!sections[index]) {
        return;
    }

    currentHeader = index;
    selectedIndex = 0;

    searchInput.value = '';

    renderObjectList();

    if (currentEntries.length > 0) {
        selectObject(0);
    } else {
        detailsContent.replaceChildren();
    }
}

//===================
// Search
//===================

async function handleSearch(query) {
    const q = query.toLowerCase().trim();

    const entries = await window.readerAPI.getEntryData(currentHeader);

    if (!q) {
        selectedIndex = 0;

        await renderObjectList();

        if (currentEntries.length > 0) {
            selectObject(0);
        } else {
            detailsContent.replaceChildren();
        }

        return;
    }

    const filteredEntries = [];
    const filteredIndices = [];

    entries.forEach((entry, index) => {
        const searchableText = JSON.stringify(entry).toLowerCase();

        if (searchableText.includes(q)) {
            filteredEntries.push(entry);
            filteredIndices.push(index);
        }
    });

    selectedIndex = 0;

    await renderObjectList(filteredEntries, filteredIndices);

    if (currentEntries.length > 0) {
        selectObject(0);
    } else {
        detailsContent.replaceChildren();
    }
}


//===================
// Quick Access
//===================

async function renderQuickAccess() {
    const files = await window.readerAPI.getFileUI();

    fileAccessList.replaceChildren();

    for (const name of files) {
        const li = document.createElement('li');

        li.textContent = name;

        li.addEventListener('click', () => {
            loadQuickAccessFile(name);
        });

        fileAccessList.appendChild(li);
    }
}


async function loadQuickAccessFile(name) {
    const success = await window.readerAPI.loadFileQuickAccess(name);

    if (!success) {
        return;
    }
}

//=======
// Modal
//=======

async function openKnownFilesModal() {
    knownFilesModal.classList.add('active');

    try {
        const data = await window.readerAPI.getMainCacheFiles();

        knownFilesAll = data.indexed;
        knownFilesFiltered = knownFilesAll;

        renderKnownFiles(knownFilesFiltered);

    } catch (err) {
        console.error('Failed to load known files.', err);
    }
}


function closeKnownFilesModal() {
    knownFilesModal.classList.remove('active');
    knownFilesSearchEl.value = '';
}


function renderKnownFiles(files) {
    knownFilesListEl.replaceChildren();

    for (const file of files) {
        const entry = document.createElement('div');

        entry.className = 'known-file-entry';

        entry.innerHTML = `
            <div class="known-file-name"></div>
            <div class="known-file-path"></div>
        `;

        entry.querySelector('.known-file-name').textContent = file.name;

        entry.querySelector('.known-file-path').textContent = file.path;

        entry.addEventListener('click', () => {
            loadFileFromModal(file);
        });

        knownFilesListEl.appendChild(entry);
    }
}


function handleKnownFilesSearch(query) {
    const q = query.toLowerCase().trim();

    knownFilesFiltered = !q
        ? knownFilesAll
        : knownFilesAll.filter(file =>
            file.name.toLowerCase().includes(q) ||
            file.path.toLowerCase().includes(q)
        );

    renderKnownFiles(knownFilesFiltered);
}


async function loadFileFromModal(selectedEntry) {
    const success = await window.readerAPI.loadFileMain(selectedEntry.path);

    if (!success) {
        return;
    }

    closeKnownFilesModal();
}


//========
// Events
//========

// Load file
btnLoadFile.addEventListener('click', async () => {
    const success = await window.readerAPI.loadFileManually();

    if (!success) {
        return;
    }
});


// Search
searchInput.addEventListener('input', async event => {
    await handleSearch(event.target.value);
});


// Quick access
btnAllFiles.addEventListener('click', () => {
    openKnownFilesModal();
});


// Modal
closeModalBtn.addEventListener('click', () => {
    closeKnownFilesModal();
});

knownFilesSearchEl.addEventListener('input', event => {
    handleKnownFilesSearch(event.target.value);
});


autoGameScanBtn.addEventListener('click', async () => {
    await window.readerAPI.autoScan();

    const data = await window.readerAPI.getMainCacheFiles();

    knownFilesAll = data.indexed;
    knownFilesFiltered = knownFilesAll;

    renderKnownFiles(knownFilesFiltered);
});


manualFolderScanBtn.addEventListener('click', async () => {
    await window.readerAPI.useScanner();

    const data = await window.readerAPI.getMainCacheFiles();

    knownFilesAll = data.indexed;
    knownFilesFiltered = knownFilesAll;

    renderKnownFiles(knownFilesFiltered);
});


//===================
// Section dropdown
//===================

sectionSelectorButton.addEventListener('click', () => {
    sectionSelectorButton.classList.toggle('active');
    sectionSelectorMenu.classList.toggle('active');
});


sectionSelectorMenu.addEventListener('click', async event => {
    const option = event.target.closest('.section-selector-option');

    if (!option) {
        return;
    }

    const index = Number(option.dataset.index);
    const headerName = await window.readerAPI.getHeaderName(index);

    if(!hasBeenImplemented(headerName)) {
        window.readerAPI.makeMessage("Section not implemented", 
            `${headerName} is not implemented yet.`, 
            `The ${headerName} section will be implemented in a future update. Check again later!`
        );

        return;
    }

    selectHeader(index);

    sectionSelectorButton.classList.remove('active');
    sectionSelectorMenu.classList.remove('active');
});


//===================
// Object selection
//===================

objectListEl.addEventListener('click', event => {
    const row = event.target.closest('.object-row');

    if (!row || !objectListEl.contains(row)) {
        console.log('Does not contain row.');
        return;
    }

    const index = Number(row.dataset.index);

    selectObject(index);
});


//===================
// External UI updates
//===================

window.readerAPI.onUiUpdate(async () => {
    reloadCurrentFile();
});


window.readerAPI.onModalUI(async () => {
    try {
        const files = await window.readerAPI.getMainCacheFiles();

        knownFilesAll = files.indexed;
        knownFilesFiltered = knownFilesAll;

        renderKnownFiles(knownFilesFiltered);

    } catch {
        console.log('Modal render message was collected but processing went wrong somewhere');
    }
});


//=========
// Start
//=========

reloadCurrentFile();