pragma solidity ^0.4.2;

contract EthCapsule {
  struct Depositor {
    uint numCapsules;
    mapping (uint => Capsule) capsules;
  }

  struct Capsule {
    uint value;
    uint lockTime;
    uint duration;
    uint unlockTime;
  }

  mapping (address => Depositor) depositors;

  function bury(uint duration) payable {
    require(msg.value > 0);
    
    if (depositors[msg.sender].numCapsules <= 0) {
        depositors[msg.sender] = Depositor({numCapsules: 0});
    }

    depositors[msg.sender].numCapsules++;
    Depositor storage depositor = depositors[msg.sender];
    depositor.capsules[depositor.numCapsules] = Capsule({
        value: msg.value,
        lockTime: block.timestamp,
        duration: duration,
        unlockTime: block.timestamp + duration
    });
  }
  
  function getNumberOfCapsules() constant returns (uint) {
    return depositors[msg.sender].numCapsules;
  }
  
  function getCapsuleInfo(uint capsuleNum) constant returns (uint, uint, uint, uint) {
    return (
        depositors[msg.sender].capsules[capsuleNum].value,
        depositors[msg.sender].capsules[capsuleNum].lockTime,
        depositors[msg.sender].capsules[capsuleNum].duration,
        depositors[msg.sender].capsules[capsuleNum].unlockTime
    );
  }

  function getContractValue() constant returns (uint) {
      return this.balance;
  }
}