const { PrismaClient } = require("@prisma/client");
const { getDataExtraction } = require("../utils/csv");
const { convertInteger } = require("../utils/number");
const { downloadAuctionPropertiesList } = require("../utils/file");
const cheerio = require("cheerio");
const axios = require("axios");
const httpClient = axios.create();
httpClient.defaults.timeout = 3000;
const {
  UpdateAuctionPropertiesInfo,
} = require("../shared/UpdateAuctionPropertiesInfo");

class UpdateAuctionPropertiesUseCase {
  async execute() {
    const allData = [];
    const prisma = new PrismaClient();
    let totalRows = 0;
    try {
      await downloadAuctionPropertiesList();
      console.log("Start rows file...");
      await getDataExtraction({
        filePath: "src/tmp/auction_properties.csv",
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
              accept_financing: false,
              photo_link: "",
              registration_property_link: "",
            });
          }
        },
      });
      console.log("Start rows details...");
      let index = 0;
      const total = allData.length;
      for (let item of allData) {
        index++;
        try {
          const { data } = await httpClient(item.access_link, { headers: {} });
          const $ = cheerio.load(data);
          this.setDescription($, item);
          this.setPhotoLink($, item);
          this.setAcceptFinancing($, item);
          this.setRegistrationPropertyLink($, item);
          UpdateAuctionPropertiesInfo.info = `${index} de: ${total}`;
        } catch (error) {
          console.error("Error:", error.message);
        }
      }
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
      console.error("Error fetching auction properties:", error.message);
      throw error;
    }
  }

  setDescription($, item) {
    try {
      const descriptionInfoItems = [$($("span")[7]).text()];
      const description = $($(".related-box > p")[1])
        .text()
        .replace("Descrição:", "");
      const hasPrivateArea = descriptionInfoItems[0].indexOf("privativa") > 0;
      if (hasPrivateArea) {
        descriptionInfoItems.push($($("span")[8]).text());
      }
      if (description.length > 1) {
        descriptionInfoItems.push(description);
      }
      item.description = descriptionInfoItems.join(", ");
    } catch {}
  }

  setPhotoLink($, item) {
    try {
      item.photo_link = $("#preview").attr("src");
    } catch {}
  }

  setAcceptFinancing($, item) {
    try {
      item.accept_financing =
        $($(".related-box > p")[2]).text().indexOf("Permite financiamento") > 0;
    } catch {}
  }

  setRegistrationPropertyLink($, item) {
    try {
      item.registration_property_link =
        $(".related-box > span > a")
          .attr("onclick")
          .split("('")[1]
          .replace("')", "") ?? "";
    } catch {}
  }
}

exports.UpdateAuctionPropertiesUseCase = UpdateAuctionPropertiesUseCase;
