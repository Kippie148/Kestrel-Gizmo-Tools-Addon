export function createDataBlock (label, value, type) {
    const block = document.createElement("div");
    block.className = "data-block";
    block.dataset.type = type;

    const labelElement = document.createElement("div");
    labelElement.className = "data-label";
    labelElement.textContent = label;

    const valueElement = document.createElement("div");
    valueElement.className = "data-value";
    valueElement.textContent = value;

    block.append(labelElement, valueElement);

    return block;
}

export function createListBlock(label, values, type) {
    const block = document.createElement("div");
    block.className = "data-block data-list";
    block.dataset.type = type;

    const labelElement = document.createElement("div");
    labelElement.className = "data-label";
    labelElement.textContent = label;

    const listElement = document.createElement("div");
    listElement.className = "data-list-values";

    values.forEach(value => {
        const item = document.createElement("div");
        if(value === null) {
            item.className = "empty-data-list-item";
        } else {
            item.className = "data-list-item";
        }
        item.textContent = value ?? "Unused Value";

        listElement.appendChild(item);
    });

    block.append(labelElement, listElement);

    return block;
}

export function createVectorBlock (label, values, subLabels, type) {
    const block = document.createElement("div");
    block.className = "data-block data-vector";
    block.dataset.type = type;

    const labelElement = document.createElement("div");
    labelElement.className = "data-label";
    labelElement.textContent = label;
    
    const valuesElement = document.createElement("div");
    valuesElement.className = "vector-values";

    const axes = subLabels

    values.forEach((value, index) => {
        const item = document.createElement("div");
        item.className = "vector-value";

        const axis = document.createElement("span");
        axis.className = "vector-axis";
        axis.textContent = axes[index] ?? index;

        const number = document.createElement("span");
        number.className = "vector-number";
        number.textContent = value ?? "";

        item.append(axis, number);
        valuesElement.appendChild(item);
    });

    block.append(labelElement, valuesElement);

    return block;
}

export function createBooleanBlock (label, value, type) {
    const block = document.createElement("div");
    block.className = "data-block data-boolean";
    block.dataset.type = type;

    const labelElement = document.createElement("div");
    labelElement.className = "data-label";
    labelElement.textContent = label;

    const indicator = document.createElement("div");
    indicator.className = "boolean-indicator";
    indicator.dataset.value = value ? "true" : "false";

    const text = document.createElement("span");
    text.textContent = value ? "Yes" : "No";

    indicator.appendChild(text);
    block.append(labelElement, indicator);

    return block;
}

export function arrayString(label, values, useComma = false) {
    let completeString = '';

    for(const value of values) {
        completeString += value;
        if(useComma) {
            completeString += ',   ';
        }
    }

    if(useComma) {
        completeString = completeString.slice(0, -2);
    }

    return createDataBlock(label, completeString, "string");
}

export function objectArray(label, values, type) {
    const block = document.createElement("div");
    block.className = "data-block object-array";
    block.dataset = type;

    const labelElement = document.createElement("div");
    labelElement.className = "data-label";
    labelElement.textContent = label;

    const list = document.createElement("div");
    list.className = "object-array-list";

    block.append(labelElement, list);

    for (const value of values) {
        const entry = document.createElement("div");
        entry.className = "object-array-entry";

        const header = document.createElement("div");
        header.className = "object-array-entry-header";

        header.textContent = value.name ?? "Unnamed";

        const content = document.createElement("div");
        content.className = "object-array-entry-content";

        entry.append(header, content);
        list.appendChild(entry);
    }

    return block;
}

export function createBooleanArray(label, values) {
    const block = document.createElement("div");
    block.className = "data-block boolean-array";

    const labelElement = document.createElement("div");
    labelElement.className = "data-label";
    labelElement.textContent = label;

    const valuesElement = document.createElement("div");
    valuesElement.className = "boolean-array-values";

    for (let i = 0; i < values.length; i += 2) {
        const row = document.createElement("div");
        row.className = "boolean-array-row";

        for (let j = i; j < Math.min(i + 2, values.length); j++) {
            const item = document.createElement("div");
            item.className = "boolean-array-item";

            const name = document.createElement("span");
            name.className = "boolean-array-name";
            name.textContent = values[j].label;

            const indicator = document.createElement("span");
            indicator.className = "boolean-array-indicator";
            indicator.dataset.value = values[j].value ? "true" : "false";

            indicator.textContent = values[j].value ? "●" : "○";

            item.append(name, indicator);
            row.appendChild(item);
        }

        valuesElement.appendChild(row);
    }

    block.append(labelElement, valuesElement);

    return block;
}

export function createAnimSetArray (label, values) {
     const block = document.createElement("div");
    block.className = "data-block object-array";

    const labelElement = document.createElement("div");
    labelElement.className = "data-label";
    labelElement.textContent = label;

    const list = document.createElement("div");
    list.className = "object-array-list";

    for (const value of values) {
        const entry = document.createElement("div");
        entry.className = "object-array-entry";

        const name = document.createElement("div");
        name.className = "object-array-name";
        name.textContent = value.animation;

        const data = document.createElement("div");
        data.className = "object-array-values";

        data.innerHTML = `
            <span>Float1: ${value.floats[0]}</span>
            <span>Float2: ${value.floats[1]}</span>
            <span>Int: ${value.int}</span>
        `;

        entry.append(name, data);
        list.appendChild(entry);
    }

    block.append(labelElement, list);

    return block;
}

export function getDivider () {
    const block = document.createElement("div");
    block.className = "divider-line";

    block.innerHTML = `
        <div class="divider"></div>
    `

    return block;
}

//=============================
// Section Specific Components
//=============================

export function createMiniCutSubEntryBlock (values) {
    const block = document.createElement("div");
    block.className = "minicutsubentry-block";

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

        <div/>
    `;

    const generalContent = block.querySelector('.general-content');
    const connectedGroup = block.querySelector('.connected-group');
    const extraVars = block.querySelector('.extra-variables');

    if(values.name !== null) {
        generalContent.append(
            createDataBlock('Name', values.name, 'float')
        )
    }

    generalContent.append(
        createDataBlock('Zoom', values.zoom, 'float'),
        createDataBlock('Transition Slowdown', values.transitionSlowdown, 'float')
    );

    connectedGroup.append(
        createVectorBlock('Position', values.coords, ["X", "Y", "Z"], 'coords'),
        createDataBlock('Rotation Y', values.rotations[0], 'rotation'),
        createDataBlock('Rotation X', values.rotations[1], 'rotation'),
        createDataBlock('Rotation Z', values.rotations[2], 'rotation')
    );

    if(values.uchar !== null) {
        extraVars.append(
            createDataBlock('Uchar', values.uchar, 'uchar')
        )
    }
    
    extraVars.append(
        createListBlock('Floats', values.floats, 'float')
    );

    return block;
}

export function shortArray(label, values) {
    const block = document.createElement("div");
    block.className = "data-block short-array";

    const labelElement = document.createElement("div");
    labelElement.className = "data-label";
    labelElement.textContent = label;

    const valuesElement = document.createElement("div");
    valuesElement.className = "short-array-values";

    for (const value of values) {
        const valueElement = document.createElement("div");
        valueElement.className = "short-array-value";
        valueElement.textContent = value;

        valuesElement.appendChild(valueElement);
    }

    block.append(
        labelElement,
        valuesElement
    );

    return block;
}

export function createDoorObjectArray(label, values) {
    const block = document.createElement("div");
    block.className = "data-block object-array";

    const title = document.createElement("div");
    title.className = "data-label";
    title.textContent = label;

    const list = document.createElement("div");
    list.className = "object-array-list";

    for (let i = 0; i < values.length; i++) {
        const entry = document.createElement("div");
        entry.className = "object-array-entry";

        const header = document.createElement("div");
        header.className = "object-array-entry-header";
        header.textContent = `Entry ${i + 1}`;

        const content = document.createElement("div");
        content.className = "object-array-entry-content";

        const NuVec = createVectorBlock(
            "NuVec",
            values[i].NuVec,
            ["X", "Y", "Z"]
        );

        const shorts = shortArray(
            "Shorts",
            values[i].Shorts
        );

        content.append(
            NuVec,
            shorts
        );

        entry.append(
            header,
            content
        );

        list.appendChild(entry);
    }

    block.append(
        title,
        list
    );

    return block;
}

export function cityBricksArray(label, values) {
    const block = document.createElement("div");
    block.className = "data-block uint-array";

    const labelElement = document.createElement("div");
    labelElement.className = "data-label";
    labelElement.textContent = label;

    const valuesElement = document.createElement("div");
    valuesElement.className = "uint-array-values";

    for (const value of values) {
        const valueElement = document.createElement("div");
        valueElement.className = "uint-array-value";
        valueElement.textContent = value.Uints;

        valuesElement.appendChild(valueElement);
    }

    block.append(
        labelElement,
        valuesElement
    );

    return block;
}

//========================
// Object List Components
//========================

export function makeUiListHeader(values) {
    const header = document.createElement("div");
    header.className = "table-header";

    for (const value of values) {
        const span = document.createElement("span");
        span.textContent = value;

        header.appendChild(span);
    }

    return header;
}

export function makeUiListEntry(values, index) {
    const row = document.createElement("div");
    row.className = "object-row";
    row.dataset.index = index;

    for (const value of values) {
        const span = document.createElement("span");
        span.textContent = value ?? "";

        row.appendChild(span);
    }

    return row;
}

export function makeUiListEntryRegularObjects(values, index) {
    const row = document.createElement("div");
    row.className = `object-row`;
    row.dataset.index = index;

    for (const value of values) {
        const span = document.createElement("span");
        span.textContent = value ?? "";

        row.appendChild(span);
    }

    return row;
}

export function makeUiListEntryPickUp(values, index) {
    const row = document.createElement("div");
    row.className = `object-row pickup-header`;
    row.dataset.index = index;

    for (const value of values) {
        const span = document.createElement("span");
        span.textContent = value ?? "";

        row.appendChild(span);
    }

    return row;
}