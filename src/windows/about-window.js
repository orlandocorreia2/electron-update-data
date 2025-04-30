const { BrowserWindow, nativeTheme } = require("electron");
const path = require("node:path");

const aboutWindow = () => {
  nativeTheme.themeSource = "dark";
  const fatherWindow = BrowserWindow.getFocusedWindow();
  if (fatherWindow) {
    const win = new BrowserWindow({
      width: 600,
      height: 480,
      resizable: false,
      icon: path.join(__dirname, "..", "assets", "icon.png"),
      parent: fatherWindow,
      modal: true,
    });
    win.loadFile("src/screens/about/about.html");
  }
};

exports.aboutWindow = aboutWindow;
