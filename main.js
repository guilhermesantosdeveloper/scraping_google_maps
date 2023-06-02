const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const shell = require('electron').shell;
const path = require('path');

const saveInfo = require('./src/saveInfo');
const convertJsonToCsvString = require('./src/convertJsonToCsvString')


let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 600,
    icon: path.resolve(__dirname, 'static', 'icons', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
  })
  //mainWindow.webContents.openDevTools()

  mainWindow.loadFile(path.resolve(__dirname, 'static', 'index.html'));
  mainWindow.removeMenu();

})


ipcMain.on('pesquisa', async (e) => {
  const arr = await saveInfo(mainWindow);
  const csvString = convertJsonToCsvString(arr)
  mainWindow.send('salvar', csvString)

})
