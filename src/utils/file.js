const { getPage, closeBrowser } = require("./playwrite");

const downloadAuctionPropertiesList = async () => {
  console.log("Start download file...");
  const page = await getPage(false);
  await page.goto(
    "https://venda-imoveis.caixa.gov.br/sistema/download-lista.asp"
  );
  const waitForDownloadEvent = page.waitForEvent("download");
  await page.waitForSelector("#cmb_estado");
  await page.selectOption("#cmb_estado", { value: "geral" });
  await page.click("#btn_next1");
  const download = await waitForDownloadEvent;
  await download.saveAs("src/tmp/auction_properties.csv");
  await closeBrowser();
  console.log("Finish download file...");
};

const getDetailAuctionProperty = async (access_link, page) => {
  await page.goto(access_link);
  const photo_link_src = await page.locator("#preview").getAttribute("src");
  if (photo_link_src) {
    console.log("photo_link_src", {
      totalDetails: _totaldetails,
      photo_link_src,
    });
  }
};

exports.downloadAuctionPropertiesList = downloadAuctionPropertiesList;
exports.getDetailAuctionProperty = getDetailAuctionProperty;
