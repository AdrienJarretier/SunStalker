const {app, BrowserWindow} = require('electron')

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function createWindow () {
  
  let mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadFile('electron.html')

  console.log('Hello server')
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

app.on('ready', createWindow)