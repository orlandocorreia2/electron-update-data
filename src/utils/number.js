const convertInteger = (value) => {
  return parseInt(value.replace(/\./g, "").replace(/\,/g, ""));
};

exports.convertInteger = convertInteger;
