var EthCapsule = artifacts.require("./EthCapsule.sol");

module.exports = function(deployer) {
  deployer.deploy(EthCapsule);
};
