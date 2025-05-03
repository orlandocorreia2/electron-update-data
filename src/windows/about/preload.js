const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("about", {
  close: async () => {
    ipcRenderer.send("window-about-close", "close");
  },
});
