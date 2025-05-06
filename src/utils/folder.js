const fs = require("fs");

const createFolterIfNotExists = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true, chmod: 777 });
  }
};

exports.createFolterIfNotExists = createFolterIfNotExists;
