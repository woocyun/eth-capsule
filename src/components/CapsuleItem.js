import React from 'react';
import moment from 'moment';

const CapsuleItem = (props) => {
  const {
    capsules,
    capsuleId,
    onWithdraw
    // web3
  } = props;

  const capsule = capsules.find(capsule => capsule.id === Number(capsuleId));

  return (
    <div>
      {capsule ?
        <div>
          <div>
            Withdrawn: {capsule.withdrawnTime} {capsule.withdrawnTime > 0 ? 'true' : 'false'}
          </div>
          <div>
            Date buried: {moment(capsule.lockTime * 1000).format('MMM Do YYYY h:mm a')}
          </div>
          <div>
            Date available to recover: {moment(capsule.unlockTime * 1000).format('MMM Do YYYY h:mm a')}
          </div>
          <button onClick={onWithdraw(capsule.id)}>Withdraw</button>
        </div>:
        ''
      }
    </div>
  );
};

export default CapsuleItem;