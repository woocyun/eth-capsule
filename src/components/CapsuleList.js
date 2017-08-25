import React from 'react';
import moment from 'moment';

import { List, ListItem } from 'material-ui/List';
import {red500, /*blue500*/} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';

import Lock from 'material-ui/svg-icons/action/lock';
// import LockOpen from 'material-ui/svg-icons/action/lock-open';

const CapsuleList = (props) => {
  const {
    capsules,
    capsulesLoading,
    web3
  } = props;

  return (
    <div>
      {capsulesLoading?
        <div style={{ padding: '70px 0', textAlign: 'center' }}>
          <CircularProgress
            size={60}
            thickness={5}
          />
        </div> :
        <List>
          {capsules.map((capsule, idx) => (
            <ListItem
              primaryText={`
                ${moment(capsule.unlockTime * 1000).format('MMM Do YYYY h:mm a')}
                (${web3.fromWei(capsule.value, 'ether')} ether)
              `}
              leftIcon={
                <Lock
                  color={red500}
                />
              }
              key={idx}
            >
            </ListItem>
          ))}
        </List>
      }
    </div>
  );
};

export default CapsuleList;