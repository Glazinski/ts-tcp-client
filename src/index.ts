import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { TcpClient } from './TcpClient';

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
    mainWindow.webContents.openDevTools();
};

app.on('ready', () => {
    createWindow();

    ipcMain.on('send-file', (e, payload: string) => {
        console.log(payload);
        const tcpClient = new TcpClient(23456, '127.0.0.1');
        tcpClient.init();

        tcpClient.send(payload);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
