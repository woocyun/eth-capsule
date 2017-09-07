import React from 'react';

import Divider from 'material-ui/Divider';

const Instructions = () => {
  return (
    <div style={{ padding: '5px 20px 10px'}}>
      <p className="question">
        How do I bury an Eth capsule?
      </p>
      <p className="answer">
        Click on the down arrow on top right toolbar and select "Bury a Capsule".
        Fill in the date and time that you would like to bury your Ether until.
        Press the "Bury" button to initiate transaction with MetaMask.
      </p>
      <Divider />
      <p className="question">
        Once I bury a capsule, will I be able to open it early in case of an emergency?
      </p>
      <p className="answer">
        The contract does not allow for withdrawals before the date of unlock. No one will be able to help you open a capsule early.
      </p>
      <Divider />
      <p className="question">
        Are there any fees for using Eth Capsule?
      </p>
      <p className="answer">
        Apart from the gas you pay for interacting with the contract, there are no other fees incurred for using this service.
      </p>
      <Divider />
      <p className="question">
        What are the risks when using Eth Capsule?
      </p>
      <p className="answer">
        This was a beginner's project to learn how to create a Dapp, so use at your own risk!
      </p>
      {/* <p className="question">Click on the down arrow on top right toolbar and select "Bury a Capsule".</p>
      <p>Fill in the date and time that you would like to bury your Ether until.</p>
      <p>Press the "Bury" button to initiate transaction. (Warning: You will not be able to retrieve your buried Ether until the date/time that you've specified!)</p>
      <p>You can bury multiple capsules and keep track of them on the main page.</p>
      <p>Apart from the gas you pay for your transactions, there are no other fees incurred for using this service.</p> */}
    </div>
  );
};

export default Instructions;