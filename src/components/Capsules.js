import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom'

import { List, ListItem } from 'material-ui/List';
import { red500, blue500, grey500 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import Lock from 'material-ui/svg-icons/action/lock';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import Drafts from 'material-ui/svg-icons/content/drafts';

const Capsules = (props) => {
  const {
    capsules,
    capsulesLoading,
    onCapsuleSelect,
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
        capsules.length ?
          <List>
            {capsules.map((capsule, idx) => (
              <ListItem
                onClick={onCapsuleSelect(capsule.id, true)}
                primaryText={`
                  ${moment(capsule.unlockTime * 1000).format('MMM Do YYYY h:mm a')}
                  (${web3.fromWei(capsule.value, 'ether')} ether)
                `}
                leftIcon={capsule.withdrawnTime > 0 ?
                  <Drafts color={grey500} /> :
                  new Date(capsule.unlockTime * 1000) > new Date() ?
                    <Lock color={red500} /> :
                    <LockOpen color={blue500} />
                }
                style={{ opacity: capsule.withdrawnTime > 0 ? 0.5 : 1 }}
                key={idx}
              >
              </ListItem>
            ))}
          </List> :
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <h3>You currently do not have any buried capsules.</h3>
            <Link to="/create">
              <FlatButton label="Bury a Capsule" primary={true} />
            </Link>
          </div>
      }
    </div>
  );
};

export default Capsules;