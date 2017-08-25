import React from 'react';
import { Route, Link } from 'react-router-dom'

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

const MatchText = ({ match }) => {
  let text;
  
  switch (match.url) {
    case '/':
      text = 'Capsules';
      break;
    case '/create':
      text = 'Bury a Capsule';
      break;
    case '/dig':
      text = 'Dig up a Capsule';
      break;
    default:
      text = 'Capsule Information';
  }

  return <div>{text}</div>;
};

const HeadToolbar = (props) => {
  return (
    <Toolbar
      style={{ paddingLeft: 50 }}>
      <ToolbarGroup firstChild={true} disabled={true}>
        <h3 style={{ fontWeight: 400 }}>
          <Route exact path="/" component={MatchText} />
          <Route exact path="/:id" component={MatchText} />
        </h3>
      </ToolbarGroup>
      <ToolbarGroup>
        <IconMenu
          iconButtonElement={
            <IconButton touch={true}>
              <NavigationExpandMoreIcon />
            </IconButton>
          }
        >
          <MenuItem primaryText={
            <Link to="/">
              Capsules
            </Link>
          }/>
          <MenuItem primaryText={
            <Link to="/create">
              Bury a Capsule
            </Link>
          }>
          </MenuItem>
          <MenuItem primaryText="Instructions" />
          <MenuItem primaryText="FAQ" />
          <MenuItem primaryText="Contract" />
        </IconMenu>
      </ToolbarGroup>
    </Toolbar>
  );
};

export default HeadToolbar;