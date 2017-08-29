pragma solidity ^0.4.11;

import './Ownable.sol';

contract EthCapsule is Ownable {
  struct Depositor {
    uint numCapsules;
    mapping (uint => Capsule) capsules;
  }

  mapping (address => Depositor) depositors;

  struct Capsule {
    uint value;
    uint id;
    uint lockTime;
    uint unlockTime;
    uint withdrawnTime;
  }

  uint public minDeposit = 1000000000000000;
  uint public totalCapsules;
  uint public totalValue;
  uint public totalBuriedCapsules;

  function bury(uint duration) payable {
    require(msg.value >= minDeposit);
    
    if (depositors[msg.sender].numCapsules <= 0) {
        depositors[msg.sender] = Depositor({ numCapsules: 0 });
    }

    Depositor storage depositor = depositors[msg.sender];
    
    depositor.capsules[++depositor.numCapsules] = Capsule({
        value: msg.value,
        id: depositors[msg.sender].numCapsules,
        lockTime: block.timestamp,
        unlockTime: block.timestamp + duration,
        withdrawnTime: 0
    });

    totalBuriedCapsules++;
    totalCapsules++;
    totalValue += msg.value;
  }

  function dig(uint capsuleNumber) {
    Capsule storage capsule = depositors[msg.sender].capsules[capsuleNumber];

    require(capsule.unlockTime < block.timestamp && capsule.withdrawnTime == 0);

    totalBuriedCapsules--;
    capsule.withdrawnTime = block.timestamp;
    msg.sender.transfer(capsule.value);
  }

  function setMinDeposit(uint min) onlyOwner {
    minDeposit = min;
  }
  
  function getCapsuleInfo(uint capsuleNum) constant returns (uint, uint, uint, uint, uint) {
    return (
        depositors[msg.sender].capsules[capsuleNum].value,
        depositors[msg.sender].capsules[capsuleNum].id,
        depositors[msg.sender].capsules[capsuleNum].lockTime,
        depositors[msg.sender].capsules[capsuleNum].unlockTime,
        depositors[msg.sender].capsules[capsuleNum].withdrawnTime
    );
  }

  function getNumberOfCapsules() constant returns (uint) {
    return depositors[msg.sender].numCapsules;
  }

  function totalBuriedValue() constant returns (uint) {
    return this.balance;
  }
}
