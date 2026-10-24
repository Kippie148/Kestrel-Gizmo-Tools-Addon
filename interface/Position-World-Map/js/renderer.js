const mapContainer = document.getElementById("map-container");
const mapCanvas = document.getElementById("map-canvas");
const mapViewer = document.getElementById("map-viewer");

const objectType = document.getElementById("object-type");
const objectSubtype = document.getElementById("object-subtype");
const objectSubtypeFilter = document.getElementById("object-subtype-filter");
const objectCount = document.getElementById("object-count");

const objectSearch = document.getElementById("object-search");

const toggleWaypoint = document.getElementById("toggle-waypoint");
const toggleGrid = document.getElementById("toggle-grid");
const toggleObjects = document.getElementById("toggle-icons");

const coordinateX = document.getElementById("coordinate-x");
const coordinateY = document.getElementById("coordinate-y");
const coordinateZ = document.getElementById("coordinate-z");

const waypointX = document.getElementById("waypoint-x");
const waypointY = document.getElementById("waypoint-y");
const waypointZ = document.getElementById("waypoint-z");
const btnClearWaypoint = document.getElementById("btn-clear-waypoint");

const selectedObjectContent = document.getElementById("selected-object-content");

const btnClearSelection = document.getElementById("btn-clear-selection");

const btnReset = document.getElementById("btn-reset");

const tooltip = document.getElementById("object-tooltip");

const mapData = {
    map_pixelsX: 7168,
    map_pixelsZ: 6656,

    map_world_sizeX: 1470.0,
    map_world_sizeZ: 1365.0,

    map_centreX: 105,
    map_centreZ: -52.5
};

const objectTypes = [
    "GIZSIMPLEPROPOBJECT",
    "GizObstacle",
    "GizSpellIt",
    "GizHint",
    "TightRope",
    "Door",
    "Ledge",
    "Ladder",
    "Pole",
    "Tube",
    "Grapple",
    "Techno",
    "Blowup",
    "Plug",
    "GizSwitch",
    "LightBeam",
    "GizmoPickup",
    "RegularObjects"
];

for (const type of objectTypes) {
    const option = document.createElement("option");

    option.value = type;
    option.textContent = type;

    objectType.appendChild(option);
}

const objectSubtypes = {
    GizmoPickup: [
        "71",
        "80",
        "98",
        "102",
        "103",
        "104",
        "106",
        "112",
        "113",
        "114",
        "115",
        "118",
        "122",
        "default"
    ],

    RegularObjects: [
        "GIZSIMPLEPROPOBJECT",
        "GizObstacle",
        "GizSpellIt",
        "ComplexGizmo",
        "GizSwitch",
        "Blowup",
        "GizItem",
        "GizSuperBuild"
    ]
};

const pickupSignatures = {
    71: 'Golden Brick',
    80: '2x2 Super Brick',
    98: 'Blue Coin',
    102: 'Small Brick Piece',
    103: 'Golden Coin',
    104: 'Heart',
    106: '2x4 Super Brick',
    112: 'Purple Coin',
    113: 'Parkour Token',
    114: 'Red Brick',
    115: 'Silver Coin',
    118: 'Time Token',
    122: 'Character/Vehicle Token',
    default: 'Rest'
};

let viewer = null;

let currentObjects = [];
let filteredObjects = [];

let selectedObject = null;

let lastClickedObjects = [];
let lastClickedIndex = -1;

let waypoint = null;

const mapContext = mapCanvas.getContext("2d");

viewer = OpenSeadragon({
    element: mapViewer,

    tileSources: {
        type: "image",
        url: "map.png"
    },

    showNavigationControl: false,
    showNavigator: false,

    showHomeControl: false,
    showZoomControl: false,
    showFullPageControl: false,
    showRotationControl: false,

    mouseNavEnabled: true,

    homeFillsViewer: true,

    constrainDuringPan: true,
    visibilityRatio: 1,

    minZoomImageRatio: 1,
    maxZoomPixelRatio: 5,

    homeFillsViewer: true,
    constrainDuringPan: true,
    visibilityRatio: 1
});

function resetMapView() {
    viewer.viewport.goHome(true);
}

function drawGrid(ctx) {
    if (!toggleGrid.checked) {
        return;
    }

    ctx.beginPath();

    const gridSize = 6;

    const worldMinX = mapData.map_centreX - mapData.map_world_sizeX / 2;

    const worldMaxX = mapData.map_centreX + mapData.map_world_sizeX / 2;

    const worldMinZ = mapData.map_centreZ - mapData.map_world_sizeZ / 2;

    const worldMaxZ = mapData.map_centreZ + mapData.map_world_sizeZ / 2;

    for (let x = Math.ceil(worldMinX / gridSize) * gridSize; x <= worldMaxX; x += gridSize) {
        const mapPosition = worldToMapPixel(x, worldMaxZ);

        const screenPosition = mapPixelToScreen(mapPosition.x, mapPosition.y);

        ctx.moveTo(screenPosition.x, 0);
        ctx.lineTo(screenPosition.x, mapCanvas.height);
    }

    for (let z = Math.ceil(worldMinZ / gridSize) * gridSize; z <= worldMaxZ; z += gridSize) {
        const mapPosition = worldToMapPixel(worldMinX, z);

        const screenPosition = mapPixelToScreen(mapPosition.x, mapPosition.y);

        ctx.moveTo(0, screenPosition.y);
        ctx.lineTo(mapCanvas.width, screenPosition.y);
    }

    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";

    ctx.lineWidth = 1;

    ctx.stroke();
}

function worldToMapPixel(x, z) {
    const worldMinX = mapData.map_centreX - mapData.map_world_sizeX / 2;

    const worldMaxZ = mapData.map_centreZ + mapData.map_world_sizeZ / 2;

    const normalizedX = (x - worldMinX) / mapData.map_world_sizeX;

    const normalizedZ = (worldMaxZ - z) / mapData.map_world_sizeZ;

    return {
        x: normalizedX * mapData.map_pixelsX,
        y: normalizedZ * mapData.map_pixelsZ
    };
}

function mapPixelToWorld(pixelX, pixelY) {
    const normalizedX = pixelX / mapData.map_pixelsX;

    const normalizedZ = pixelY / mapData.map_pixelsZ;

    const worldMinX = mapData.map_centreX - mapData.map_world_sizeX / 2;

    const worldMaxZ = mapData.map_centreZ + mapData.map_world_sizeZ / 2;

    return {
        x: worldMinX + normalizedX * mapData.map_world_sizeX,
        z: worldMaxZ - normalizedZ * mapData.map_world_sizeZ
    };
}

function screenToMapPixel(screenX, screenY) {
    return viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(screenX, screenY));
}

function mapPixelToScreen(mapPixelX, mapPixelY) {
    return viewer.viewport.imageToViewerElementCoordinates(new OpenSeadragon.Point(mapPixelX, mapPixelY));
}

function redrawMapOverlay() {
    mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

    drawGrid(mapContext);
    drawObjects(mapContext);
    drawWaypoint(mapContext);
}

function drawObjects(ctx) {
    if (!toggleObjects.checked) {
        return;
    }

    for (const object of filteredObjects) {
        if (!object.coords || object.coords.length < 3) {
            continue;
        }

        const [worldX, worldY, worldZ] = object.coords;

        const mapPosition = worldToMapPixel(worldX, worldZ);

        const screenPosition = mapPixelToScreen(mapPosition.x, mapPosition.y);

        ctx.beginPath();

        ctx.arc(screenPosition.x, screenPosition.y, 5, 0, Math.PI * 2);

        const isSelected = object === selectedObject;

        ctx.fillStyle = isSelected ? "#43a047" : "#e53935";

        ctx.fill();
    }
}

async function loadSelectedObjects() {
    const headerName = objectType.value;
    const key = objectSubtype.value;

    if (!headerName) {
        currentObjects = [];
        filteredObjects = [];

        objectCount.textContent = "0 objects";

        redrawMapOverlay();
        return;
    }

    if (headerName === "GizmoPickup" || headerName === "RegularObjects") {
        if (!key) {
            currentObjects = [];
            filteredObjects = [];

            objectCount.textContent = "0 objects";

            redrawMapOverlay();
            return;
        }

        currentObjects = await window.mapAPI.getEntries(headerName, key);

    } else {
        currentObjects = await window.mapAPI.getEntries(headerName);
    }

    filteredObjects = currentObjects;

    objectCount.textContent = `${filteredObjects.length} objects`;

    redrawMapOverlay();
}

function findObjectAtPosition(mapX, mapY) {
    const hitRadius = 10;
    const candidates = [];

    for (const object of filteredObjects) {
        if (!object.coords || object.coords.length < 3) {
            continue;
        }

        const position = worldToMapPixel(object.coords[0], object.coords[2]);

        const distanceX = mapX - position.x;

        const distanceY = mapY - position.y;

        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance <= hitRadius) {
            candidates.push({object, distance});
        }
    }

    if (candidates.length === 0) {
        lastClickedObjects = [];
        lastClickedIndex = -1;

        return null;
    }

    candidates.sort((a, b) => a.distance - b.distance);

    const objects = candidates.map(candidate => candidate.object);

    if (objects.length !== lastClickedObjects.length || objects.some((object, index) => object !== lastClickedObjects[index])) {
        lastClickedObjects = objects;
        lastClickedIndex = -1;
    }

    lastClickedIndex = (lastClickedIndex + 1) % lastClickedObjects.length;

    return lastClickedObjects[lastClickedIndex];
}

async function selectObject(object) {
    selectedObject = object;

    const pathName = await window.mapAPI.pathByIndex(object.index);

    selectedObjectContent.innerHTML = `
        <div class="selected-object-name">
            <span>Name</span>
            <strong>${object.name}</strong>
        </div>

        <div class="selected-object-row">
            <span>Type</span>
            <strong>${objectType.value}</strong>
        </div>

        <div class="selected-object-row">
            <span>Position</span>
            <strong>
                ${object.coords[0].toFixed(3)},
                ${object.coords[1].toFixed(3)},
                ${object.coords[2].toFixed(3)}
            </strong>
        </div>

        <div class="selected-object-row">
            <span>File</span>
            <strong>${pathName}</strong>
        </div>
    `;

    redrawMapOverlay();
}

function drawWaypoint(ctx) {
    if (!waypoint) {
        return;
    }

    const mapPosition = worldToMapPixel(waypoint.x, waypoint.z);

    const screenPosition = mapPixelToScreen(mapPosition.x, mapPosition.y);

    ctx.beginPath();

    ctx.arc(screenPosition.x, screenPosition.y, 6, 0, Math.PI * 2);

    ctx.fillStyle = "#2196f3";

    ctx.fill();
}

objectSearch.addEventListener("input", () => {
    const search = objectSearch.value.trim().toLowerCase();

    if (!search) {
        filteredObjects = currentObjects;
    } else {
        filteredObjects = currentObjects.filter(object => object.name && object.name.toLowerCase().includes(search));
    }

    objectCount.textContent = `${filteredObjects.length} objects`;

    lastClickedObjects = [];
    lastClickedIndex = -1;

    redrawMapOverlay();
});

btnClearWaypoint.addEventListener("click", () => {
    waypoint = null;

    waypointX.textContent = "---";
    waypointZ.textContent = "---";

    redrawMapOverlay();
});

viewer.addHandler("canvas-click", (event) => {

    if (!event.quick) {
        return;
    }

    const mapPosition = screenToMapPixel(event.position.x, event.position.y);

    if (toggleWaypoint.checked) {

        const worldPosition = mapPixelToWorld(mapPosition.x, mapPosition.y);

        waypoint = {
            x: worldPosition.x,
            z: worldPosition.z
        };

        waypointX.textContent = waypoint.x.toFixed(5);

        waypointZ.textContent = waypoint.z.toFixed(5);

        redrawMapOverlay();

        event.preventDefaultAction = true;

        return;
    }

    const object = findObjectAtPosition(mapPosition.x, mapPosition.y);

    if (!object) {
        return;
    }

    selectObject(object);

    event.preventDefaultAction = true;
});

function resizeMapCanvas() {
    mapCanvas.width = mapContainer.clientWidth;

    mapCanvas.height = mapContainer.clientHeight;

    redrawMapOverlay();
}

viewer.addHandler("viewport-change", () => {
    redrawMapOverlay();
});

window.addEventListener("resize", () => {
    resizeMapCanvas();
});

mapCanvas.addEventListener("click", async (event) => {
    const rect = mapContainer.getBoundingClientRect();

    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    const mapPosition = screenToMapPixel(screenX, screenY);

    const object = findObjectAtPosition(mapPosition.x, mapPosition.y);

    if (!object) {
        return;
    }

    await selectObject(object);
});

btnClearSelection.addEventListener("click", () => {
    selectedObject = null;

    selectedObjectContent.innerHTML = `
        <div class="selected-empty">
            Click an object on the map
        </div>
    `;

    redrawMapOverlay();
});

objectType.addEventListener("change", async () => {
    const type = objectType.value;

    if (type === "GizmoPickup" || type === "RegularObjects") {
        objectSubtypeFilter.style.display = "block";

        objectSubtype.innerHTML = `<option value="">Select subtype...</option>`;

        for (const subtype of objectSubtypes[type]) {
            const option = document.createElement("option");

            option.value = subtype;
            if(type === 'GizmoPickup') {
                option.textContent = pickupSignatures[subtype];
            } else {
                option.textContent = subtype;
            }

            objectSubtype.appendChild(option);
        }

        currentObjects = [];
        filteredObjects = [];

        objectCount.textContent = "0 objects";

        redrawMapOverlay();

        return;
    }

    objectSubtypeFilter.style.display = "none";

    objectSubtype.innerHTML = `<option value="">Select subtype...</option>`;

    await loadSelectedObjects();
});

objectSubtype.addEventListener("change", async () => {
    await loadSelectedObjects();
});

toggleGrid.addEventListener("change", () => {
    redrawMapOverlay();
});

toggleObjects.addEventListener("change", () => {
    redrawMapOverlay();
});

viewer.addHandler("open", () => {
    resizeMapCanvas();

    resetMapView();

    mapViewer.style.visibility = "visible";
});

btnReset.addEventListener("click", () => {
    resetMapView();
});

mapContainer.addEventListener("mousemove", (event) => {
    const rect = mapContainer.getBoundingClientRect();

    const screenX = event.clientX - rect.left;

    const screenY = event.clientY - rect.top;

    const mapPosition = screenToMapPixel(screenX, screenY);

    const worldPosition = mapPixelToWorld(mapPosition.x, mapPosition.y);

    coordinateX.textContent = worldPosition.x.toFixed(3);

    coordinateY.textContent = "---";

    coordinateZ.textContent = worldPosition.z.toFixed(3);
});