pragma solidity ^0.5.1;

contract Funding {
    address payable public owner;
    uint public finishesAt;
    uint public goal;
    uint public raised;
    mapping(address => uint) public balances;

    constructor(uint _duration, uint _goal) public {
        owner = msg.sender;
        finishesAt = now + _duration;
        goal = _goal;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "You must be the owner");
        _;
    }

    modifier onlyNotFinished() {
        require(!isFinished());
        _;
    }

    modifier onlyFunded() {
        require(isFunded(), "Not funded");
        _;
    }

    function isFunded() view public returns (bool) {
        return raised >= goal; 
    }

    function withdraw() public onlyOwner onlyFunded {
         owner.transfer(address(this).balance);   
         //msg.sender.transfer(msg.sender.balance); 
    }

    function isFinished() public view returns (bool) {
        return finishesAt <= now; 
    }

    function donate() public onlyNotFinished payable {
        balances[msg.sender] += msg.value;
        raised += msg.value; 
    } 
}