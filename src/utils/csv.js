const fs = require("fs");
const csv = require("csv-parser");

const getDataExtraction = ({ filePath, fn, separator = ";" }) => {
  return new Promise((resolve, _) => {
    const response = [];
    let index = 0;
    fs.createReadStream(filePath, "latin1")
      .pipe(csv({ separator }))
      .on("data", (data) => {
        response.push(data);
        fn(data, index);
        index++;
      })
      .on("end", () => {
        resolve(response);
      });
  });
};

exports.getDataExtraction = getDataExtraction;
