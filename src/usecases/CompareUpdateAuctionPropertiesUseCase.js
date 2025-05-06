const { app } = require("electron");
const { SaveAuctionProperties } = require("../shared/SaveAuctionProperties");
const { getDataExtraction } = require("../utils/csv");
const { convertInteger } = require("../utils/number");
const { downloadAuctionPropertiesList, renameFile } = require("../utils/file");
const { trimObject } = require("../utils/util");
const { createFolterIfNotExists } = require("../utils/folder");

class CompareUpdateAuctionPropertiesUseCase extends SaveAuctionProperties {
  async execute() {
    this._retries = 0;
    const allDataOld = {};
    const allData = [];
    const oldNumbersProperty = {};
    const newNumbersProperty = {};
    const deleteNumbersProperty = [];
    const folderPath = `${app.getPath("documents")}/jarvis_leiloes/tmp`;
    try {
      createFolterIfNotExists(folderPath);
      renameFile({
        oldName: `${folderPath}/auction_properties.csv`,
        newName: `${app.getPath(
          "documents"
        )}/jarvis_leiloes/tmp/auction_properties_old.csv`,
      });
      await downloadAuctionPropertiesList({
        saveAsPath: `${folderPath}/auction_properties.csv`,
      });
      console.log("Start rows old file...");
      await getDataExtraction({
        filePath: `${folderPath}/auction_properties_old.csv`,
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
            allDataOld[number_property] = {
              uf,
              city,
              neighborhood,
              address,
              price,
              appraisal_value,
              discount,
              property_type,
              description,
              sale_method,
              access_link,
            };
            oldNumbersProperty[number_property] = true;
          }
        },
      });
      console.log("Start rows file...");
      await getDataExtraction({
        filePath: `${folderPath}/auction_properties_old.csv`,
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
            newNumbersProperty[number_property] = true;
            const property_type = description.split(",")[0];
            const propertyOld = allDataOld[number_property];
            const hasDifference =
              propertyOld &&
              (propertyOld.uf != uf ||
                propertyOld.city != city ||
                // propertyOld.neighborhood != neighborhood ||
                // propertyOld.address != address ||
                propertyOld.price != price ||
                propertyOld.appraisal_value != appraisal_value ||
                propertyOld.discount != discount ||
                // propertyOld.property_type != property_type ||
                // propertyOld.description != description ||
                // propertyOld.sale_method != sale_method ||
                propertyOld.access_link != access_link);
            const canAdd = !propertyOld || hasDifference;
            if (canAdd) {
              const addData = trimObject({
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
              allData.push(addData);
              deleteNumbersProperty.push(number_property);
            }
          }
        },
      });
      await this.setDetails(allData);
      await this.delete({
        oldNumbersProperty,
        newNumbersProperty,
        deleteNumbersProperty,
      });
      await this._prisma.auctionProperty.createMany({ data: allData });
      await this.retryData();
      console.log("Finished data...");
      return { totalRows: allData.length };
    } catch (error) {
      console.error("Error fetching auction properties:", error.message);
      throw error;
    }
  }

  async delete({
    oldNumbersProperty,
    newNumbersProperty,
    deleteNumbersProperty,
  }) {
    console.log("Start delete rows...");
    Object.keys(oldNumbersProperty).forEach((oldNumberPropertyKey) => {
      if (!newNumbersProperty[oldNumberPropertyKey]) {
        deleteNumbersProperty.push(oldNumberPropertyKey);
      }
    });
    await this._prisma.auctionProperty.deleteMany({
      where: { number_property: { in: deleteNumbersProperty } },
    });
    console.log("Finish delete rows...");
  }
}

exports.CompareUpdateAuctionPropertiesUseCase =
  CompareUpdateAuctionPropertiesUseCase;
