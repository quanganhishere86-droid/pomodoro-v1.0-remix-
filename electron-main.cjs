const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    title: "Pomofruti",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Disabling to ensure youtube iframes and local assets load seamlessly from file://
    }
  });

  // Load the production build index.html directly
  const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
  win.loadFile(indexPath);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
