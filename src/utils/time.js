const calculateTimeBySeconds = (totalSeconds) => {
  const hours = parseInt(totalSeconds / 3600);
  const minutes = parseInt((totalSeconds % 3600) / 60);
  const seconds = parseInt((totalSeconds % 3600) % 60);
  return `Tempo total: ${hours}:${minutes}:${seconds}`;
};

exports.calculateTimeBySeconds = calculateTimeBySeconds;
