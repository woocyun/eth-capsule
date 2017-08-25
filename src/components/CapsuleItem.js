import React from 'react';
import moment from 'moment';

import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

const CapsuleItem = (props) => {
  const {
    capsules,
    capsuleId,
    onWithdraw,
    web3
  } = props;

  const capsule = capsules.find(capsule => capsule.id === Number(capsuleId));

  return (
    <div>
      {capsule ?
        <div>
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn>
                  Value:
                </TableRowColumn>
                <TableRowColumn>
                  {web3.fromWei(capsule.value, 'ether').toString()} Ether
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>
                  Date buried:
                </TableRowColumn>
                <TableRowColumn>
                  {moment(capsule.lockTime * 1000).format('hh:mm A on MMMM Do, YYYY')}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>
                  Date of unlock:
                </TableRowColumn>
                <TableRowColumn>
                  {moment(capsule.unlockTime * 1000).format('hh:mm A on MMMM Do, YYYY')}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>
                  Date opened:
                </TableRowColumn>
                <TableRowColumn>
                  {capsule.withdrawnTime > 0 ? moment(capsule.withdrawnTime * 1000).format('hh:mm A on MMMM Do, YYYY') : 'Not yet opened'}
                </TableRowColumn>
              </TableRow>
              {capsule.withdrawnTime === 0 &&
                <TableRow>
                  <TableRowColumn>
                    Open Capsule:
                  </TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton
                      label={new Date(capsule.unlockTime * 1000) > new Date() ?
                        'Locked' :
                        'Open'
                      }
                      disabled={new Date(capsule.unlockTime * 1000) > new Date()}
                      primary={true}
                      onClick={onWithdraw(capsule.id)}
                    />
                  </TableRowColumn>
                </TableRow>
              }
            </TableBody>
          </Table>
        </div>:
        ''
      }
    </div>
  );
};

export default CapsuleItem;