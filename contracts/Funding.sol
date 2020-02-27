pragma solidity ^0.5.1;

contract Funding {
    address public owner;
    uint public finishesAt;
    uint public raised;
    mapping(address => uint) public balances;

    constructor(uint _duration) public {
        owner = msg.sender;
        finishesAt = now + _duration;
    }

    function isFinished() public view returns (bool) {
        return finishesAt <= now; 
    }

    function donate() public payable {
        balances[msg.sender] += msg.value;
        raised += msg.value; 
    } 
}