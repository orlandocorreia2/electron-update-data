const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("updateRegisters").innerHTML = "Atualizar Registros";
});

contextBridge.exposeInMainWorld("api", {
  updateAuctionProperties: async () => {
    return await ipcRenderer.invoke("updateAuctionProperties");
  },
  updateAuctionPropertiesInfo: async () => {
    return await ipcRenderer.invoke("updateAuctionPropertiesInfo");
  },
});
