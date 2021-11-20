const options = {
  runValidators: true,
  new: true,
};

const limiterConfig = {
  winsowMs: 15 * 60 * 1000,
  max: 100,
};

module.exports = { options, limiterConfig };
