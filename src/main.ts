import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { spawn, ChildProcess } from 'node:child_process';
import net from 'node:net';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let nestAppProcess: ChildProcess | null = null;
const API_PORT = 8888;
const API_HOST = '127.0.0.1';

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

function waitForApiPort (
  host: string,
  port: number,
  retries = 30,
  intervalMs = 300
): Promise<boolean> {
  return new Promise((resolve) => {
    let attempt = 0;

    const tryConnect = () => {
      const socket = new net.Socket();

      socket.setTimeout(500);
      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.once('timeout', () => socket.destroy());
      socket.once('error', () => socket.destroy());
      socket.once('close', () => {
        attempt += 1;
        if (attempt >= retries) {
          resolve(false);
          return;
        }
        setTimeout(tryConnect, intervalMs);
      });

      socket.connect(port, host);
    };

    tryConnect();
  });
}

// This method will be called when Electron has finished initialization
// and is ready to create browser windows.
app.on('ready', async () => {
  const nestAppDirectory = path.join(__dirname, '../../server');
  nestAppProcess = spawn('node', ['--experimental-require-module', 'dist/src/main'], { cwd: nestAppDirectory });

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

  nestAppProcess.on('error', (err) => {
    console.error('Failed to start NestJS process:', err);
  });

  const isApiReady = await waitForApiPort(API_HOST, API_PORT);
  if (!isApiReady) {
    console.warn(`NestJS API did not become ready on ${API_HOST}:${API_PORT} in time`);
  }
  createWindow();
});

// Quit when all windows are closed, except on macOS.
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
