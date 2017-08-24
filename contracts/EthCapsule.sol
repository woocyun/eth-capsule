pragma solidity ^0.4.2;

contract EthCapsule {
  struct Depositor {
    uint numCapsules;
    mapping (uint => Capsule) capsules;
  }

  struct Capsule {
    uint value;
    uint lockTime;
  }

  mapping (address => Depositor) depositors;

  function bury(uint lockTime) payable returns (uint) {
    require(msg.value > 0);
    
    if (depositors[msg.sender].numCapsules <= 0) {
        depositors[msg.sender] = Depositor({numCapsules: 0});
    }

    depositors[msg.sender].numCapsules++;
    Depositor storage depositor = depositors[msg.sender];
    depositor.capsules[depositor.numCapsules] = Capsule({ value: msg.value, lockTime: lockTime });
    
    return msg.value;
  }
  
  function getBlockTime() constant returns (uint) {
      return block.timestamp;
  }
  
  function getNumberOfCapsules() constant returns (uint) {
    return depositors[msg.sender].numCapsules;
  }
  
  function getCapsuleInfo(uint capsuleNum) constant returns (uint, uint) {
    return (
        depositors[msg.sender].capsules[capsuleNum].value,
        depositors[msg.sender].capsules[capsuleNum].lockTime
    );
  }

  function getContractValue() constant returns (uint) {
      return this.balance;
  }
}
