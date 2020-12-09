const electron = require("electron");
const ipc = electron.ipcRenderer;

function openBrowser(event, url) {
    event.preventDefault();
    ipc.send("open-browser", url);
}