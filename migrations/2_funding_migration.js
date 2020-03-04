const Funding = artifacts.require("Funding");
const DAY = 3600 * 12;

const FINNEY = 10**15;
const goal = (100*FINNEY).toString();

module.exports = function(deployer) {
  deployer.deploy(Funding, DAY, goal);
  //deployer.deploy(Funding);
};
