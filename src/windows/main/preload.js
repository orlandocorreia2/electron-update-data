const { contextBridge, ipcRenderer, app } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("updateRegisters").innerHTML = "Atualização Completa";
});

contextBridge.exposeInMainWorld("api", {
  updateAuctionProperties: async () => {
    return await ipcRenderer.invoke("updateAuctionProperties");
  },
  compareUpdateAuctionProperties: async () => {
    return await ipcRenderer.invoke("compareUpdateAuctionProperties");
  },
  updateAuctionPropertiesInfo: async () => {
    return await ipcRenderer.invoke("updateAuctionPropertiesInfo");
  },
  reloadApp: async () => {
    ipcRenderer.send("window-main-reload", "reload");
  },
});
