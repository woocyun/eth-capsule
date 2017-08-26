import React from 'react';

const Instructions = () => {
  return (
    <div style={{ padding: '5px 20px 10px'}}>
      <p>Click on the down arrow on top right toolbar and select "Bury a Capsule".</p>
      <p>Fill in the date and time that you would like to bury your Ether until.</p>
      <p>Press the "Bury" button to initiate transaction. (Warning: You will not be able to retrieve your buried Ether until the date/time that you've specified!)</p>
      <p>You can bury multiple capsules and keep track of them on the main page.</p>
      <p>Apart from the gas you pay for your transactions, there are no other fees incurred for using this service.</p>
    </div>
  );
};

export default Instructions;