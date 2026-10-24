exports.start = () => {

    const menuBuilder = require("../../menu-builder");


    menuBuilder.modifyMenu(
        menu => {

            menu.push({
                label: 'Giz Tools',
                
                submenu: [
                    {
                        label: 'Object JSON Generator',
                        click: () => {
                            console.log('loading generator');
                            require('./logic/GIZ-generator/main-program').openGizGeneratorWindow();
                        }
                    },
                    {
                        label: 'Interactive World Map',
                        click: () => {
                            console.log('loading world map.');
                            require('./logic/position-world-map/main-program').openMapWindow();
                        }
                    },
                    {
                        label: 'GIZ File Reader',
                        click: () => {
                            console.log('loading reader.');
                            require('./logic/GIZ-file-reader/main-program').openReaderWindow();
                        }
                    }
                ]
            })

        }
    );

    menuBuilder.applyMenu();
}