import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import HelpIcon from '@mui/icons-material/Help';

const toolbarStyle = {
  height: '100px', // Adjust the height as needed
};

const listItemStyle = {
  margin: '10px 0',
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
};

const listItemTextStyle = {
  paddingLeft: '16px',
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Drawer
        variant="permanent"
        classes={{
          paper: 'drawer-paper', 
        }}
        anchor="left"
        style={{ width: 180 }} 
        PaperProps={{ style: { width: 240 } }}
      >
        <div style={toolbarStyle} />
        <List>
          <ListItem button component={Link} to="/home" style={listItemStyle}>
            <HomeIcon />
            <ListItemText primary="Home" style={listItemTextStyle} />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/add-applicant" style={listItemStyle}>
            <PersonAddIcon />
            <ListItemText primary="Add Applicant" style={listItemTextStyle} />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/view-applicants" style={listItemStyle}>
            <PeopleIcon />
            <ListItemText primary="View Applications" style={listItemTextStyle} />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/view-employees" style={listItemStyle}>
            <BadgeIcon />
            <ListItemText primary="View Employees" style={listItemTextStyle} />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/help" style={listItemStyle}>
            <HelpIcon />
            <ListItemText primary="Help" style={listItemTextStyle} />
          </ListItem>
        </List>

      </Drawer>
    </div>
  );
};

export default Sidebar;
