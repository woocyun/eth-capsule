import React from 'react';

import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

const CommunityStats = (props) => {
  const {
    // account,
    // balance,
    // contractValue,
    totalCapsules,
    totalValue,
    totalBuriedCapsules,
    totalBuriedValue,
    web3
  } = props;

  return (
    <div>
      <Toolbar>
        <ToolbarGroup>
          <h3 style={{ fontWeight: 400 }}>Community Stats</h3>
        </ToolbarGroup>
      </Toolbar>
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>
              Currently buried capsules:
            </TableRowColumn>
            <TableRowColumn>
              {totalBuriedCapsules}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>
              Value of currently buried capsules:
            </TableRowColumn>
            <TableRowColumn>
              {web3 ? web3.fromWei(totalBuriedValue, 'ether').toString() : 0} Ether
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>
              Total number of capsules created:
            </TableRowColumn>
            <TableRowColumn>
              {totalCapsules}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>
              Total value of capsules created:
            </TableRowColumn>
            <TableRowColumn>
              {web3 ? web3.fromWei(totalValue, 'ether').toString() : 0} Ether
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CommunityStats;