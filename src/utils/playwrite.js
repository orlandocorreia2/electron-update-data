const playwright = require("playwright");
const os = require("os");
const { version } = require("../../package.json");

const { username } = os.userInfo();
let browser;

const getPage = async (headless = true) => {
  browser = await playwright.chromium.launch({
    headless,
    // executablePath: playwright.chromium.executablePath(),
    executablePath: `C:\\Users\\${username}\\AppData\\Local\\auction_properties_update\\app-${version}\\resources\\playwright-browsers\\chromium-1169\\chrome-win\\chrome.exe`,
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
