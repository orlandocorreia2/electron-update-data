const playwright = require("playwright");

let browser;

const getPage = async (headless = true) => {
  browser = await playwright.chromium.launch({
    headless,
    executablePath: playwright.chromium.executablePath(),
  });
  const context = await browser.newContext({
    ...playwright.devices["Desktop Chrome"],
    acceptDownloads: true,
    ignoreHTTPSErrors: true,
  });
  return await context.newPage();
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
  }
};

exports.getPage = getPage;
exports.closeBrowser = closeBrowser;
