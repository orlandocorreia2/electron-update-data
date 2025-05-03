const { BrowserWindow, nativeTheme, ipcMain } = require("electron");
const path = require("node:path");

let window = null;

const aboutWindow = () => {
  nativeTheme.themeSource = "dark";
  const fatherWindow = BrowserWindow.getFocusedWindow();
  if (fatherWindow) {
    window = new BrowserWindow({
      width: 600,
      height: 480,
      resizable: false,
      frame: false,
      icon: path.join(__dirname, "..", "assets", "icon.png"),
      parent: fatherWindow,
      modal: true,
      autoHideMenuBar: true,
      darkTheme: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    window.loadFile("src/screens/about/about.html");
  }
};

ipcMain.on("window-about-close", () => {
  window.close();
});

exports.aboutWindow = aboutWindow;
