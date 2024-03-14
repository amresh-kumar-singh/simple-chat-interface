const ansiColors = (text, color) => {
  const colors = {
    green: 32,
    blue: 34,
    yellow: 33,
    red: 31,
  };
  if (colors[color]) return `\x1b[${colors[color]}m${text}\x1b[0m`;
  //default is green here
  return `\x1b[32m${text}\x1b[0m`;
};

export default ansiColors;
