import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut, reset } from "../../redux/auth/authSlice";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    dispatch(signOut());
    dispatch(reset());
    navigate("/sign-in");
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#2196F3" }}>
      <Toolbar>
        <img
          style={{ height: "50px", objectFit: "contain" }} // Adjust height as needed
          src="/images/favicon.png"
          alt="logo"
        />
        <Typography
          variant="h6"
          noWrap
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "white",
          }}
        >
          Belle Babysitters Portal
        </Typography>

        {user ? (
          // Show these options when the user is signed in
          <>
            <IconButton
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          // Show these options when the user is not signed in
          <>
            <Button component={RouterLink} to="/sign-in" color="inherit">
              Sign In
            </Button>
            <Button component={RouterLink} to="/sign-up" color="inherit">
              Sign Up
            </Button>
            <Button
              href="https://bellebabysitters.co.nz/contact-us/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              Contact Us
            </Button>
          </>
        )}

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {user && (
            <MenuItem onClick={handleMenuClose}>
              <Button component={RouterLink} to="/profile">
                Profile
              </Button>
            </MenuItem>
          )}
          <MenuItem onClick={handleMenuClose}>
            <Button
              href="https://bellebabysitters.co.nz/contact-us/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </Button>
          </MenuItem>
          {user && (
            <MenuItem onClick={handleMenuClose}>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
