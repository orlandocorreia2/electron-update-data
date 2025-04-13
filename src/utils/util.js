const sleep = (time = 1) => {
  console.log(`Sleeping for ${time} seconds...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time * 1000);
  });
};

exports.sleep = sleep;
