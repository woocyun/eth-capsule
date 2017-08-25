pragma solidity ^0.4.2;

contract EthCapsule {
  struct Depositor {
    uint numCapsules;
    mapping (uint => Capsule) capsules;
  }

  struct Capsule {
    uint value;
    uint id;
    uint lockTime;
    uint unlockTime;
    uint withdrawnTime;
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
        id: depositors[msg.sender].numCapsules,
        lockTime: block.timestamp,
        unlockTime: block.timestamp + duration,
        withdrawnTime: 0
    });
  }

  function dig(uint capsuleNumber) {
    Capsule storage capsule = depositors[msg.sender].capsules[capsuleNumber];
    require(capsule.unlockTime < block.timestamp && capsule.withdrawnTime == 0);
    capsule.withdrawnTime = block.timestamp;
    msg.sender.transfer(capsule.value);
  }
  
  function getNumberOfCapsules() constant returns (uint) {
    return depositors[msg.sender].numCapsules;
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

  function getContractValue() constant returns (uint) {
      return this.balance;
  }
}
