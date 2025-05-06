const sleep = (time = 1) => {
  console.log(`Sleeping for ${time} seconds...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time * 1000);
  });
};

const trimObject = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const trimmedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      trimmedObj[key] = value;
      if (typeof value === "string") trimmedObj[key] = value.trim();
      if (typeof value === "object" && value !== null)
        trimmedObj[key] = trimObject(value);
    }
  }
  return trimmedObj;
};

exports.sleep = sleep;
exports.trimObject = trimObject;
