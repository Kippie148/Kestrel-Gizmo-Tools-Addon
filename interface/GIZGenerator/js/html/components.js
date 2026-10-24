export function createTextInput(header, placeholder, mandatory, type) {
    const block = document.createElement('div');

    block.className = 'input-group';
    block.dataset.type = type;

    if (mandatory) {
        block.classList.add('required-field');
    }

    const label = document.createElement('label');
    label.textContent = header;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;

    block.append(label, input);

    return block;
}

export function createCoordinatesInput(header, mandatory, type) {
    const block = document.createElement('div');
    
    block.className = 'coords-box';
    block.dataset.type = type;

    if (mandatory) {
        block.classList.add('required-box');
    }

    const title = document.createElement('div');
    title.className = 'coords-title';
    title.textContent = header;

    const grid = document.createElement('div');
    grid.className = 'coords-grid';

    ['X', 'Y', 'Z'].forEach(axis => {
        const inputBox = document.createElement('div');
        inputBox.className = 'coord-input';

        const label = document.createElement('label');
        label.textContent = axis;

        const input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';

        inputBox.append(label, input);
        grid.appendChild(inputBox);
    });

    block.append(title, grid);

    return block;
}

export function createMultipleNumberBoxes(headers, mandatory, type) {
    const block = document.createElement('div');

    block.className = 'number-boxes';
    block.dataset.type = type;

    if (mandatory) {
        block.classList.add('required-box');
    }

    block.style.setProperty('--number-count', headers.length);

    const grid = document.createElement('div');
    grid.className = 'number-boxes-grid';

    headers.forEach(header => {
        const inputBox = document.createElement('div');
        inputBox.className = 'number-input';

        const label = document.createElement('label');
        label.textContent = header;

        const input = document.createElement('input');
        input.type = 'number';

        inputBox.append(label, input);
        grid.appendChild(inputBox);
    });

    block.appendChild(grid);

    return block;
}

export function createSelectListInput(header, options, colours, mandatory, type) {
    const block = document.createElement('div');

    block.className = 'input-group';
    block.dataset.type = type;

    if (mandatory) {
        block.classList.add('required-field');
    }

    const label = document.createElement('label');
    label.textContent = header;

    const select = document.createElement('select');

    options.forEach((optionText, index) => {
        const option = document.createElement('option');

        option.textContent = optionText;
        option.value = optionText;

        if (colours && colours[index]) {
            option.style.color = colours[index];
        }

        select.appendChild(option);
    });

    block.append(label, select);

    return block;
}

export function createList(header, values = [], type = "list") {
    const block = document.createElement("div");
    block.className = "input-group list-group";
    block.dataset.type = type;

    const label = document.createElement("label");
    label.textContent = header;

    const list = document.createElement("div");
    list.className = "string-list";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "list-add-btn";
    addButton.textContent = "+ Add import";

    function addString(value = "") {
        const row = document.createElement("div");
        row.className = "string-list-row";

        const input = document.createElement("input");
        input.type = "text";
        input.value = value;
        input.placeholder = "Enter a string";

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "list-remove-btn";
        removeButton.textContent = "×";
        removeButton.title = "Remove string";

        removeButton.addEventListener("click", () => {
            row.remove();
        });

        row.append(input, removeButton);
        list.appendChild(row);
    }

    values.forEach(value => addString(value));

    addButton.addEventListener("click", () => {
        addString();
    });

    block.append(label, list, addButton);

    return block;
}

export function createBoolBlockInput(header, names, keys) {
    const block = document.createElement('div');

    block.className = 'bool-box';
    block.dataset.type = 'boolean';

    const title = document.createElement('div');
    title.className = 'bool-title';
    title.textContent = header;

    const list = document.createElement('div');
    list.className = 'bool-list';

    names.forEach((name, index) => {
        const item = document.createElement('label');
        item.className = 'bool-item';

        const input = document.createElement('input');
        input.type = 'checkbox';

        if (keys && keys[index]) {
            input.dataset.type = keys[index];
        }

        const text = document.createElement('span');
        text.textContent = name;

        item.append(input, text);
        list.appendChild(item);
    });

    block.append(title, list);

    return block;
}