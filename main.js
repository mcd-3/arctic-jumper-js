const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;
const width = 920;
const height = 540;

let main;

// Change me to "production" when not debugging
process.env.NODE_ENV = "debug"

app.on('ready', () => {
    main = new BrowserWindow({width, height, resizable: false});
    main.loadURL(url.format({
        pathname: path.join(`${__dirname}/public`, "index.html"),
        protocol: "file:",
        slashes: true
    }));
    const menu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(menu);
});

const mainMenuTemplate = [{
        label: "File",
        submenu: [{
                label: "Quit",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
      label: 'Developer Tools',
      submenu:[
        {
          role: 'reload'
        },
        {
          label: 'Toggle DevTools',
          accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools();
          }
        }
      ]
    });
  }