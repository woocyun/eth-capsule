pragma solidity ^0.4.2;

contract SimpleStorage {
  uint storedData;

  struct Depositor {
    uint amount;
  }

  mapping (address => Depositor) public depositors;

  function set(uint x) {
    storedData = x;
  }

  function get() constant returns (uint) {
    return storedData;
  }

  function getDepositorInfo() constant returns (uint) {
    return depositors[msg.sender].amount;
  }

  function deposit() payable returns (uint) {
    depositors[msg.sender].amount += msg.value;
    // depositors[msg.sender].timeOfDeposit = timeOfDeposit;
    // depositors[msg.sender].lockTime = lockTime;
    return block.timestamp;
  }
}
