export function createObjectTree(data, handlers = {}) {
    const tree = document.createDocumentFragment();

    data.forEach((file, fileIndex) => {
        tree.appendChild(
            createFileNode(file, fileIndex, handlers)
        );
    });

    tree.appendChild(createAddPathNode(handlers));

    return tree;
}

function createFileNode(file, fileIndex, handlers) {
    const fileElement = document.createElement("div");
    fileElement.className = "tree-file";

    const header = document.createElement("div");
    header.className = "tree-file-header";

    const name = document.createElement("span");
    name.className = "tree-file-name";
    name.textContent = file.path?.split("/").pop() || "Unnamed path";

    header.appendChild(name);

    header.appendChild(
        createActionButton("edit", "✎", "Edit path", () => {
            handlers.onEditFile?.(fileIndex);
        })
    );

    header.appendChild(
        createActionButton("delete", "×", "Delete path", () => {
            handlers.onDeleteFile?.(fileIndex);
        })
    );

    header.addEventListener("click", () => {
        toggleTreeElement(fileElement);
    });

    const children = document.createElement("div");
    children.className = "tree-children";

    children.appendChild(
        createCategoryNode("Objects", file.newObjects ?? [], "objects", fileIndex, handlers)
    );

    children.appendChild(
        createCategoryNode("Coins", file.newCoins ?? [], "coins", fileIndex, handlers)
    );

    fileElement.append(header, children);

    return fileElement;
}

function createCategoryNode(name, entries, category, fileIndex, handlers) {
    const categoryElement = document.createElement("div");
    categoryElement.className = "tree-category";

    const header = document.createElement("div");
    header.className = "tree-category-header";

    const label = document.createElement("span");
    label.className = "tree-category-name";
    label.textContent = name;

    header.appendChild(label);

    header.appendChild(
        createActionButton("add", "+", `Add to ${name}`, () => {
            handlers.onAddEntry?.(category, fileIndex);
        })
    );

    header.addEventListener("click", () => {
        toggleTreeElement(categoryElement);
    });

    const children = document.createElement("div");
    children.className = "tree-children";

    entries.forEach((entry, index) => {
        if (!entry) {
            console.log(`Missing entry in ${category}, file ${fileIndex}, index ${index}`);
            return;
        }

        children.appendChild(
            createEntryNode(entry, category, index, fileIndex, handlers)
        );
    });

    categoryElement.append(header, children);

    return categoryElement;
}

function createEntryNode(entry, category, index, fileIndex, handlers) {
    const element = document.createElement("div");
    element.className = "tree-entry";

    element.dataset.fileIndex = fileIndex;
    element.dataset.category = category;
    element.dataset.index = index;

    const name = document.createElement("span");
    name.className = "tree-entry-name";
    name.textContent = entry.name || "(Unnamed entry)";

    element.appendChild(name);

    element.addEventListener("click", () => {
        handlers.onSelectEntry?.({
            fileIndex,
            category,
            index
        });
    });

    element.appendChild(
        createActionButton("edit", "✎", "Edit object", () => {
            handlers.onEditEntry?.({
                fileIndex,
                category,
                index
            });
        })
    );

    element.appendChild(
        createActionButton("delete", "×", "Delete object", () => {
            handlers.onDeleteEntry?.({
                fileIndex,
                category,
                index
            });
        })
    );

    return element;
}

function createAddPathNode(handlers) {
    const element = document.createElement("div");
    element.className = "tree-add-path";

    const icon = document.createElement("span");
    icon.className = "tree-add-path-icon";
    icon.textContent = "+";

    const label = document.createElement("span");
    label.textContent = "Add new path";

    element.append(icon, label);

    element.addEventListener("click", () => {
        handlers.onAddPath?.();
    });

    return element;
}

function createActionButton(action, symbol, label, callback) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `tree-action tree-action-${action}`;
    button.textContent = symbol;
    button.title = label;
    button.setAttribute("aria-label", label);

    button.addEventListener("click", event => {
        event.stopPropagation();
        callback();
    });

    return button;
}

export function setTreeMode(tree, mode) {
    tree.classList.remove("delete-mode", "edit-mode", "add-mode");

    if (mode !== "normal") {
        tree.classList.add(`${mode}-mode`);
    }
}

function toggleTreeElement(element) {
    element.classList.toggle("collapsed");
}
