const { SaveAuctionProperties } = require("../shared/SaveAuctionProperties");
const { PrismaClient } = require("@prisma/client");
const { getDataExtraction } = require("../utils/csv");
const { convertInteger } = require("../utils/number");
const { downloadAuctionPropertiesList } = require("../utils/file");

class UpdateAuctionPropertiesUseCase extends SaveAuctionProperties {
  async execute() {
    const allData = [];
    const prisma = new PrismaClient();
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
      await this.setDetails(allData);
      await prisma.auctionProperty.deleteMany();
      await prisma.auctionProperty.createMany({ data: allData });
      console.log("Finished data...");
      return { totalRows: allData.length };
    } catch (error) {
      console.error("Error fetching auction properties:", error.message);
      throw error;
    }
  }
}

exports.UpdateAuctionPropertiesUseCase = UpdateAuctionPropertiesUseCase;
