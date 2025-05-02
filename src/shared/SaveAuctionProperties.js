const { PrismaClient } = require("@prisma/client");
const cheerio = require("cheerio");
const axios = require("axios");
const {
  UpdateAuctionPropertiesInfo,
} = require("./UpdateAuctionPropertiesInfo");
const httpClient = axios.create();
httpClient.defaults.timeout = 3000;

class SaveAuctionProperties {
  _prisma = new PrismaClient();
  _timeoutData = [];
  _retries = 0;
  _maxRetries = 5;

  async setDetails(allData) {
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
        this._timeoutData.push(item);
      }
    }
    console.log("Finish rows details...");
  }

  async retryData() {
    if (this._timeoutData.length > 0 && this._retries >= this._maxRetries) {
      console.log(`Retring data time: ${this._retries}`);
      const retries = [];
      for (let item of this._timeoutData) {
        try {
          const { data } = await httpClient(item.access_link, { headers: {} });
          const $ = cheerio.load(data);
          this.setDescription($, item);
          this.setPhotoLink($, item);
          this.setAcceptFinancing($, item);
          this.setRegistrationPropertyLink($, item);
          await this._prisma.auctionProperty.update({
            where: { number_property: item.number_property },
            data: {
              description: item.description,
              photo_link: item.photo_link,
              accept_financing: item.accept_financing,
              registration_property_link: item.registration_property_link,
            },
          });
        } catch (error) {
          console.error("Retry Error:", error.message);
          retries.push(item);
        }
      }
      this._retries++;
      if (retries.length > 0) {
        this._timeoutData = retries;
        this.retryData();
      }
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

exports.SaveAuctionProperties = SaveAuctionProperties;
