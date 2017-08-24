import React from 'react';

import { List, ListItem } from 'material-ui/List';

const CapsuleList = (props) => {
  const {
    capsules,
    web3
  } = props;

  return (
    <List>
      {capsules.map((capsule, idx) => (
        <ListItem
          primaryText={`Value: ${web3.fromWei(capsule.value, 'ether')} / Lock Time: ${capsule.lockTime} / Opened: ${capsule.opened}`}
          key={idx}
        />
      ))}
    </List>
  );
};

export default CapsuleList;