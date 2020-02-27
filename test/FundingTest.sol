pragma solidity ^0.5.1;

import "truffle/Assert.sol";
import "../contracts/Funding.sol";
import "truffle/DeployedAddresses.sol";

contract FundingTest {
    uint public initialBalance = 10 ether;
    Funding funding;

    function () external payable {
        
    }

    function beforeEach() public {
        funding = new Funding(1 days); 
    }

    function testTrackingDonatorsBalance() public {
        // Funding funding = new Funding();
        funding.donate.value(5 finney)();
        funding.donate.value(15 finney)();
        Assert.equal(funding.balances(address(this)), 20 finney, "Donator balance is different from sum of donations"); 
    }

    function testSettingAnOwnerDuringCreation() public {
        // Funding funding = new Funding();
        Assert.equal(funding.owner(), address(this), "The owner is different from the deployer");
    }

    function testSettingAnOwnerOfDeployedContract() public {
        Funding newFunding = Funding(DeployedAddresses.Funding());
        Assert.equal(newFunding.owner(), msg.sender,"The owner is different from the deployed");
    }

    function testAcceptingDonations() public {
        // Funding funding = new Funding();
        Assert.equal(funding.raised(),0, "Initial raised amount is different from 0");

        funding.donate.value(10 finney)();
        funding.donate.value(20 finney)();
        Assert.equal(funding.raised(),30 finney,"Raised amount is different from sum of donations");
    }
}