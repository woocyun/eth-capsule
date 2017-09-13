import React from 'react';

import Divider from 'material-ui/Divider';

const FAQ = () => {
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
        How do I dig up an Eth capsule?
      </p>
      <p className="answer">
        Click on the capsule you want to dig up from the main "Capsules" menu.
        If your capsule is ready to be dug, there will be a blue "Open" button
        you can click to unlock and receive the ether contained in the capsule.
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
    </div>
  );
};

export default FAQ;