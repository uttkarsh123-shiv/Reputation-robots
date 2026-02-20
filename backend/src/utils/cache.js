const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false,
});

const generateKey = (prefix, params) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join('|');
  return `${prefix}:${sortedParams}`;
};

module.exports = { cache, generateKey };
