import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { TcpClient } from './TcpClient';
import { TcpRequest } from './types';

if (require('electron-squirrel-startup')) {
  app.quit();
}

class App {
  private createWindow = (): void => {
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

  private setListeners = (): void => {
    app.on('ready', () => {
      this.createWindow();
      ipcMain.on('send-json', (_, payload: TcpRequest) => {
        const { port, address } = payload;
        const tcpClient1 = new TcpClient(port, address);
        tcpClient1.init();
        tcpClient1.send(payload.size);

        const tcpClient2 = new TcpClient(port, address);
        tcpClient2.init();
        tcpClient2.send(payload.serializedData);
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  };

  init = (): void => {
    this.setListeners();
  };
}

const myApp = new App();
myApp.init();
