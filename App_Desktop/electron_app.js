'use strict'

const common = require('./common.js');

const { app, BrowserWindow } = require('electron')

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: common.WINDOW.WIDTH,
        height: common.WINDOW.HEIGHT
    })

    // and load the index.html of the app.
    win.loadFile('electron.html')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    app.quit();
});




