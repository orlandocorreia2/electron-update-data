const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const {
  UpdateAuctionPropertiesUseCase,
} = require("./src/usecases/UpdateAuctionPropertiesUseCase");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets", "icon.png"),
    frame: false,
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("updateAuctionProperties", async () => {
  return await new UpdateAuctionPropertiesUseCase().execute();
});
