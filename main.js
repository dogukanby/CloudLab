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
    title: "CloudLab v" + app.getVersion(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  Menu.setApplicationMenu(null);
  // index.html sets document.title on load and again on every language
  // switch, which would silently drop the version suffix from the
  // titlebar each time — intercept every title change and re-append it.
  win.on("page-title-updated", function(event, title){
    event.preventDefault();
    win.setTitle(title + " v" + app.getVersion());
  });
  win.loadFile(path.join(__dirname, "index.html"));
  return win;
}

// Checks GitHub Releases (via the latest.yml electron-builder publishes alongside
// the installer) for a newer version. Never installs anything without the user
// confirming a dialog first — this is deliberately not silent.
function setupAutoUpdater(win){
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  // The installer is signed with a self-signed certificate, which doesn't
  // chain to a trusted root the way a paid CA cert would. electron-updater's
  // default Windows verifier checks the downloaded update's publisher
  // against that trust chain, which always fails for a self-signed cert.
  // verifyUpdateCodeSignature's setter only assigns truthy values (see
  // NsisUpdater.js: `set verifyUpdateCodeSignature(value){ if(value) ... }`),
  // so passing `false` here is silently ignored and the default verifier
  // stays active — it must be replaced with a function that resolves to
  // `null` (electron-updater's own signal for "verification passed").
  // Integrity is still verified via the sha512 checksum in latest.yml.
  autoUpdater.verifyUpdateCodeSignature = () => Promise.resolve(null);

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
    const message = err && err.message ? err.message : String(err);
    console.error("[auto-updater]", err && err.stack ? err.stack : err);
    dialog.showMessageBox(win, {
      type: "error",
      title: "Update failed",
      message: "Checking for or downloading the CloudLab update failed.",
      detail: message
    });
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
