module.exports = function latestTime() {
  return web3.eth.getBlock('latest').timestamp;
};