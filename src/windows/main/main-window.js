const { app, BrowserWindow, nativeTheme, Menu, shell } = require("electron");
const path = require("node:path");
const { aboutWindow } = require("../about/about-window");

const mainWindow = () => {
  nativeTheme.themeSource = "dark";
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "..", "public", "assets", "icon.png"),
  });

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "Arquivo",
        submenu: [
          { label: "Sair", click: () => app.quit(), accelerator: "Alt+F4" },
        ],
      },
      {
        label: "Exibir",
        submenu: [
          { label: "Recarregar", role: "reload" },
          { label: "Ferramentas do Desenvolvedor", role: "toggleDevTools" },
          { type: "separator" },
          { label: "Adicionar Zoom", role: "zoomIn" },
          { label: "Diminuir Zoom", role: "zoomOut" },
          { label: "Restaurar Zoom", role: "resetZoom" },
        ],
      },
      {
        label: "Ajuda",
        submenu: [
          {
            label: "Docs",
            click: () => {
              shell
                .openExternal("https://www.electronjs.org/pt/docs/latest/")
                .catch((err) => {
                  console.error("Failed to open external link:", err);
                });
            },
          },
          { type: "separator" },
          { label: "Sobre", click: () => aboutWindow() },
        ],
      },
    ])
  );

  win.loadFile("src/screens/main/index.html");
};

exports.mainWindow = mainWindow;
