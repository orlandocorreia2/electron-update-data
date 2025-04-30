const updateRegisters = document.getElementById("updateRegisters");
const processingInfo = document.getElementById("processing");
const messageInfo = document.getElementById("messageInfo");
const registersInfo = document.getElementById("registersInfo");
const timeInfo = document.getElementById("timeInfo");

updateRegisters.addEventListener("click", async () => {
  messageInfo.innerHTML = "";
  registersInfo.innerHTML = "";
  timeInfo.innerHTML = "";
  processingInfo.style.display = "block";
  let time = 0;
  const timer = setInterval(() => {
    time++;
    window.api.updateAuctionPropertiesInfo().then((info) => {
      processingInfo.innerHTML = `Processando: ${info} registros`;
    });
  }, 1000);
  updateRegisters.disabled = true;
  updateRegisters.innerHTML = "Atualizando registros...";
  const { totalRows } = await window.api.updateAuctionProperties();
  console.log("Atualização finalizada com successo!", totalRows);
  processingInfo.style.display = "block";
  processingInfo.innerHTML = "";
  messageInfo.innerHTML = "Atualização finalizada com successo!";
  registersInfo.innerHTML = `Registros atualizados: ${totalRows}`;
  timeInfo.innerHTML = `Tempo total: ${time}`;
  updateRegisters.innerHTML = "Atualizar Registros";
  updateRegisters.disabled = false;
  clearInterval(timer);
});
