const processingInfo = document.getElementById("processing");
const messageInfo = document.getElementById("messageInfo");
const registersInfo = document.getElementById("registersInfo");
const timeInfo = document.getElementById("timeInfo");
const updateRegisters = document.getElementById("updateRegisters");
const compareUpdateRegisters = document.getElementById(
  "compareUpdateRegisters"
);
let time = 0;
let timer = null;

updateRegisters.addEventListener("click", async () => {
  clear();
  initTime();
  processing();
  window.api
    .updateAuctionProperties()
    .then(({ totalRows }) => {
      showInfo({ totalRows, time, timer });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Erro ao atualizar os registros. Tente mais tarde.");
      window.api.reloadApp();
    });
});

compareUpdateRegisters.addEventListener("click", () => {
  clear();
  initTime();
  processing();
  window.api
    .compareUpdateAuctionProperties()
    .then(({ totalRows }) => {
      showInfo({ totalRows, time, timer });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Erro ao atualizar os registros. Tente mais tarde.");
      window.api.reloadApp();
    });
});

const initTime = () => {
  time = 0;
  timer = setInterval(() => {
    time++;
    window.api.updateAuctionPropertiesInfo().then((info) => {
      processingInfo.innerHTML = `Processando: ${info} registros`;
    });
  }, 1000);
};

const clear = () => {
  messageInfo.innerHTML = "";
  registersInfo.innerHTML = "";
  timeInfo.innerHTML = "";
  processingInfo.style.display = "block";
};

const processing = () => {
  updateRegisters.disabled = true;
  compareUpdateRegisters.disabled = true;
  updateRegisters.innerHTML = "Aguarde...";
  compareUpdateRegisters.innerHTML = "Aguarde...";
};

const showInfo = ({ totalRows, time, timer }) => {
  console.log("Atualização finalizada com successo!", totalRows);
  processingInfo.style.display = "block";
  processingInfo.innerHTML = "";
  messageInfo.innerHTML = "Atualização finalizada com successo!";
  registersInfo.innerHTML = `Registros atualizados: ${totalRows}`;
  timeInfo.innerHTML = calculateTimeBySeconds(time);
  updateRegisters.innerHTML = "Atualização Completa";
  compareUpdateRegisters.innerHTML = "Atualização Simples";
  updateRegisters.disabled = false;
  compareUpdateRegisters.disabled = false;
  clearInterval(timer);
};

const calculateTimeBySeconds = (totalSeconds) => {
  const hours = parseInt(totalSeconds / 3600);
  const minutes = parseInt((totalSeconds % 3600) / 60);
  const seconds = parseInt((totalSeconds % 3600) % 60);
  return `Tempo total: ${hours}h:${minutes}m:${seconds}s`;
};
