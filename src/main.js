const { app, BrowserWindow, Menu } = require('electron');
const isDev = require("electron-is-dev");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    isDev ? win.loadURL('http://localhost:8080') : win.loadFile('./dist/index.html');
}

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New',
                click: (item, focusedWindow) => {
                    focusedWindow.webContents.send('message', 'new file')
                }
            },
            {
                label: 'Open',
            },
            {
                label: 'Save',
            },
            {
                label: 'Save as',
            },
            {
                label: 'Dev Tools',
                accelerator: 'Control+Shift+I',
                click: (item, focusedWindow) => focusedWindow.webContents.toggleDevTools()
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});