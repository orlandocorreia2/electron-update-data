window.onload = () => {
  console.log("Script loaded");
  const updateRegisters = document.getElementById("update-registers");
  const updateInfo = document.getElementById("update-info");

  updateRegisters.addEventListener("click", async () => {
    updateRegisters.disabled = true;
    updateRegisters.innerHTML = "Atualizando registros...";
    const { totalRows } = await window.api.updateAuctionProperties();
    console.log("Atualização finalizada com successo!", totalRows);
    updateInfo.innerHTML = `Atualização finalizada com successo! Total de registros atualizados: ${totalRows}`;
    updateRegisters.innerHTML = "Atualizar Registros";
    updateRegisters.disabled = false;
  });
};
