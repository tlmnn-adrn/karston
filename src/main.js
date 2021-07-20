const { app, BrowserWindow } = require('electron');
const isDev = require("electron-is-dev");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });

    isDev ? win.loadURL('http://localhost:8080') : win.loadFile('./dist/index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});