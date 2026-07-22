const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

function createWindow(){
  const win = new BrowserWindow({
    width: 1180,
    height: 860,
    minWidth: 720,
    minHeight: 560,
    backgroundColor: "#0a0d13",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, "index.html"));
  return win;
}

// Checks GitHub Releases (via the latest.yml electron-builder publishes alongside
// the installer) for a newer version. Never installs anything without the user
// confirming a dialog first — this is deliberately not silent.
function setupAutoUpdater(win){
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("update-available", function(info){
    dialog.showMessageBox(win, {
      type: "info",
      title: "Update available",
      message: "A new version of CloudLab is available (v" + info.version + ").",
      detail: "Download and install it now?",
      buttons: ["Download and install", "Later"],
      defaultId: 0,
      cancelId: 1
    }).then(function(result){
      if(result.response === 0) autoUpdater.downloadUpdate();
    });
  });

  autoUpdater.on("update-downloaded", function(){
    dialog.showMessageBox(win, {
      type: "info",
      title: "Update ready",
      message: "The update has finished downloading.",
      detail: "Restart CloudLab now to finish installing it?",
      buttons: ["Restart now", "Later"],
      defaultId: 0,
      cancelId: 1
    }).then(function(result){
      if(result.response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on("error", function(err){
    console.error("[auto-updater]", err && err.stack ? err.stack : err);
  });

  autoUpdater.checkForUpdates();
}

app.whenReady().then(function(){
  const win = createWindow();
  if(app.isPackaged){
    setTimeout(function(){ setupAutoUpdater(win); }, 3000);
  }
  app.on("activate", function(){
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function(){
  if(process.platform !== "darwin") app.quit();
});
