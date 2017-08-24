import React from 'react';

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

const HeadToolbar = (props) => {
  // const {

  // } = props;

  return (
    <Toolbar
      style={{ paddingLeft: 50 }}>
      <ToolbarGroup firstChild={true} disabled={true}>
        <h3 style={{ fontWeight: 400 }}>Your Capsules</h3>
      </ToolbarGroup>
      <ToolbarGroup>
        <IconMenu
          iconButtonElement={
            <IconButton touch={true}>
              <NavigationExpandMoreIcon />
            </IconButton>
          }
        >
          <MenuItem primaryText="Your Capsules" />
          <MenuItem primaryText="Instructions" />
          <MenuItem primaryText="FAQ" />
          <MenuItem primaryText="Contract" />
        </IconMenu>
      </ToolbarGroup>
    </Toolbar>
  );
};

export default HeadToolbar;