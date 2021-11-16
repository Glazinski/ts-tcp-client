import path from 'path';
import net from 'net';
import { app, BrowserWindow, ipcMain } from 'electron';
import { TcpClient } from './TcpClient';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

app.on('ready', () => {
    createWindow();

    // const tcpClient = new TcpClient(23456, '127.0.0.1');
    // tcpClient.init();

    ipcMain.on('send-file', (e, payload) => {
        console.log(payload);
        const socket = new net.Socket();
        socket.connect(23456, '127.0.0.1', function () {
            console.log('Connected');
            socket.write(payload);
        });

        socket.on('data', function (data: string) {
            console.log('Received: ' + data);
            socket.destroy(); // kill client after server's response
        });

        socket.on('close', function () {
            console.log('Connection closed');
        });
        // tcpClient.send(payload);
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
