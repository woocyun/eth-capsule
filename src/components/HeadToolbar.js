import React from 'react';
import { Route, Link } from 'react-router-dom'

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

const CONTRACT_URL = 'https://etherscan.io/address/0x5274a2293dbe075a82d41e873bb927403a9dce46#code';

const MatchText = ({ match }) => {
  let text;

  switch (match.url) {
    case '/':
      text = 'Your Capsules';
      break;
    case '/view':
      text = 'Capsule Information';
      break;
    case '/create':
      text = 'Bury a Capsule';
      break;
    case '/faq':
      text = 'FAQ';
      break;
    default:
      text = '';
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
          <Route path="/view" component={MatchText} />
          <Route path="/create" component={MatchText} />
          <Route path="/faq" component={MatchText} />
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
          }/>
          <MenuItem primaryText={
            <Link to="/faq">
              FAQ
            </Link>
          }/>
          <MenuItem
            primaryText="Contract"
            onClick={() => {
              window.open(CONTRACT_URL);
            }}
          />
        </IconMenu>
      </ToolbarGroup>
    </Toolbar>
  );
};

export default HeadToolbar;