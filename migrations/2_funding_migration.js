const Funding = artifacts.require("Funding");
const DAY = 3600 * 12;

module.exports = function(deployer) {
  deployer.deploy(Funding, DAY);
  //deployer.deploy(Funding);
};
