const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const shell = require('electron').shell;
const path = require('path');

const saveInfo = require('./src/saveInfo');
const convertJsonToCsvString = require('./src/convertJsonToCsvString')


let loginWindow;
app.on('ready', () => {
  loginWindow = new BrowserWindow({
    width: 1080,
    height: 800,
    icon: path.resolve(__dirname, 'static', 'icons', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
  })
  //loginWindow.webContents.openDevTools()

  loginWindow.loadFile(path.resolve(__dirname, 'static', 'login.html'));
  loginWindow.removeMenu();

})


let mainWindow;
ipcMain.on('logado', () => {
  loginWindow.close();
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 800,
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
