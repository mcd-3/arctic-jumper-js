const electron = require('electron');
const url = require('url');
const path = require('path');
const setupEvents = require('./installers/windows/setupEvents')
const shell = electron.shell
const ipc = electron.ipcMain

const {app, BrowserWindow, Menu} = electron;
const width = 920;
const height = 540;

let main;
let about;

// Change me to "production" when not debugging
process.env.NODE_ENV = "debug";

app.on('ready', () => {
  main = new BrowserWindow({width, height, resizable: false});
  main.loadURL(url.format({
      pathname: path.join(`${__dirname}/public`, "game.html"),
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
      label: "About",
      accelerator: process.platform == "darwin" ? "Command+A" : "Ctrl+A",
      click() {
        if (about == undefined || about == null) {
          openAbout();
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
}];

function openAbout() {
  about = new BrowserWindow({width: 480, height: 720, resizable: false, webPreferences: {nodeIntegration: true}});
  about.loadURL(url.format({
    pathname: path.join(`${__dirname}/public`, "about.html"),
    protocol: "file:",
    slashes: true
  }));
  about.on('close', () => about = null);
}

ipc.on("open-browser", (event, arg) => {
  shell.openExternal(arg);
});

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

if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}