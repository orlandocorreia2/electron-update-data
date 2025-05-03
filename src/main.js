const { app, BrowserWindow, ipcMain } = require("electron");
const { mainWindow } = require("./windows/main/main-window");
const {
  UpdateAuctionPropertiesUseCase,
} = require("./usecases/UpdateAuctionPropertiesUseCase");
const {
  UpdateAuctionPropertiesInfo,
} = require("./shared/UpdateAuctionPropertiesInfo");
const {
  CompareUpdateAuctionPropertiesUseCase,
} = require("./usecases/CompareUpdateAuctionPropertiesUseCase");

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

ipcMain.handle("compareUpdateAuctionProperties", async () => {
  return await new CompareUpdateAuctionPropertiesUseCase().execute();
});

ipcMain.handle("updateAuctionPropertiesInfo", () => {
  return UpdateAuctionPropertiesInfo.info;
});
