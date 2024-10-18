import { app, BrowserWindow } from 'electron';
import path from 'path';
import { exec, spawn, ChildProcess } from 'child_process';
import SteamDataFetcher from './server/server.js';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
let nestAppProcess: ChildProcess | null = null;
const createWindow = () => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const steamDataFetcher = new SteamDataFetcher();
  const nestAppDirectory = path.join(__dirname, '../../server');
  nestAppProcess = spawn('node', ['--experimental-require-module', 'dist/main'], { cwd: nestAppDirectory });

  // Capture NestJS app output for logging
  nestAppProcess.stdout.on('data', (data) => {
    console.log(`NestJS Output: ${data}`);
  });

  nestAppProcess.stderr.on('data', (data) => {
    console.error(`NestJS Error: ${data}`);
  });

  nestAppProcess.on('close', (code) => {
    console.log(`NestJS process exited with code ${code}`);
  });
  sleep(1000).then(() => createWindow());
});
function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (nestAppProcess) {
      nestAppProcess.kill(); // Terminate the NestJS process
    }
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
