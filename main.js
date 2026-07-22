const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

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
}

app.whenReady().then(function(){
  createWindow();
  app.on("activate", function(){
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function(){
  if(process.platform !== "darwin") app.quit();
});
