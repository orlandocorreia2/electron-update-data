const { PrismaClient } = require("@prisma/client");
const { getDataExtraction } = require("../utils/csv");
const { convertInteger } = require("../utils/number");
const { getPage, closeBrowser } = require("../utils/playwrite");
const { downloadAuctionPropertiesList } = require("../utils/file");

class UpdateAuctionPropertiesUseCase {
  async execute() {
    const allData = [];
    const prisma = new PrismaClient();
    let totalRows = 0;

    try {
      await downloadAuctionPropertiesList();
      console.log("Start rows file...");
      await getDataExtraction({
        filePath: "./auction_properties.csv",
        fn: async (data) => {
          const {
            _1: uf,
            _2: city,
            _3: neighborhood,
            _4: address,
            _5: price,
            _6: appraisal_value,
            _7: discount,
            _8: description,
            _9: sale_method,
            _10: access_link,
          } = data;
          const number_property = parseInt(data?._0?.replace(/\D/g, ""));
          if (
            number_property &&
            typeof number_property === "number" &&
            number_property > 0
          ) {
            totalRows++;
            const property_type = description.split(",")[0];
            allData.push({
              created_by_id: "f3ea4819-0955-4839-815f-a92e13aadbb3",
              number_property,
              uf,
              city,
              neighborhood,
              address,
              price: convertInteger(price),
              appraisal_value: convertInteger(appraisal_value),
              discount: convertInteger(discount),
              property_type,
              description,
              sale_method,
              access_link,
              accept_financing: "",
              photo_link: "",
              registration_property_link: "",
            });
          }
        },
      });
      const page = await getPage();
      const baseLinkCaixa = "https://venda-imoveis.caixa.gov.br";
      console.log("Start rows details...");
      for (let data of allData) {
        await page.goto(data.access_link);
        const photo_link = await page.locator("#preview").getAttribute("src");
        if (photo_link) {
          data.photo_link = photo_link;
        }
        const accept_financing =
          (await page.locator("p").allInnerTexts())
            .join(" | ")
            .indexOf("NÃO aceita financiamento") == -1;
        data.accept_financing = accept_financing;
        const aOnClick = await page
          .locator(".related-box > span > a")
          .getAttribute("onclick");
        const registration_property_link = aOnClick
          ? `${baseLinkCaixa}${aOnClick?.split("('")[1].replace("')", "")}`
          : "";
        data.registration_property_link = registration_property_link;
      }
      await closeBrowser();
      console.log("Finish rows details...");
      await prisma.auctionProperty.deleteMany();
      console.log("Finish delete rows...");
      await prisma.auctionProperty.createMany({
        data: allData,
      });
      console.log("Finish update auction properties...");
      return {
        totalRows,
      };
    } catch (error) {
      console.error("Error fetching auction properties:", error);
      throw error;
    }
  }
}

exports.UpdateAuctionPropertiesUseCase = UpdateAuctionPropertiesUseCase;
