const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;
const width = 920;
const height = 540;

let main;
let options;

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

    main.on('closed', () => app.quit());
});

const mainMenuTemplate = [{
        label: "File",
        submenu: [
            {
              label: "Fullscreen",
              accelerator: process.platform == "darwin" ? "Command+F" : "Ctrl+F",
              click() {
                let window = BrowserWindow.getFocusedWindow();
                window.setFullScreen(!window.isFullScreen())
              }
            },
            {
              label: "Options",
              accelerator: process.platform == "darwin" ? "Command+O" : "Ctrl+O",
              click() {
                if (options == undefined || options == null) {
                  openOptions();
                }
              }
            },
            {
                label: "Quit",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                }
            }
        ]
    }
];

function openOptions() {
  options = new BrowserWindow({width: 100, height: 100, resizable: false});
  options.loadURL(url.format({
    pathname: path.join(`${__dirname}/public`, "options.html"),
    protocol: "file:",
    slashes: true
  }));
  options.on('close', () => options = null);
}

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