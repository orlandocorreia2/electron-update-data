const { app, BrowserWindow, ipcMain } = require("electron");
const { mainWindow } = require("./windows/main-window");
const {
  UpdateAuctionPropertiesUseCase,
} = require("./usecases/UpdateAuctionPropertiesUseCase");
const {
  UpdateAuctionPropertiesInfo,
} = require("./shared/UpdateAuctionPropertiesInfo");

app.whenReady().then(() => {
  mainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("updateAuctionProperties", async () => {
  return await new UpdateAuctionPropertiesUseCase().execute();
});

ipcMain.handle("updateAuctionPropertiesInfo", () => {
  return UpdateAuctionPropertiesInfo.info;
});
