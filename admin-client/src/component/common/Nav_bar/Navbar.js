import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut, reset } from "../../../redux/auth/authSlice";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import MenuIcon from "@mui/icons-material/MenuBookOutlined";
import IconButton from "@mui/material/IconButton";
import Sidebar from "../Side_bar/SideBar";
import { Drawer, Typography, Button } from "@mui/material";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    dispatch(signOut());
    dispatch(reset());
    navigate("/sign-in");
  };
  return (
    <div className="main-container">
      <nav>
        <AppBar position="fixed" sx={{ backgroundColor: "#2196F3" }}>
          <Toolbar>
            {/* Menu button to open/close the sidebar */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              edge="start"
            >
              <img
                style={{ height: '50px', objectFit: 'contain' }} 
                src="/images/favicon.png"
                alt="logo"
              />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/home"
              sx={{
                flexGrow: 1,
                textDecoration: "none",
                color: "white",
              }}
            >
              Belle Babysitters 
            </Typography>

            {/* Add other navigation elements here */}
            <Button
              href="https://bellebabysitters.co.nz"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "white",
              }}
            >
              Website 
            </Button>
            {
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "10px",
                }}
              >
                <Button
                  variant="body2"
                  component={Link}
                  to="/user-profile"
                  sx={{
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  PROFILE
                </Button>
               
              </div>
            }
            {/* Sign Out Button */}
            <Button
              color="inherit"
              onClick={handleSignOut}
              sx={{
                marginLeft: "10px", 
              }}
            >
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
      </nav>
      <Drawer open={open} onClose={handleDrawerClose}>
        <Sidebar />
      </Drawer>
    </div>
  );
};

export default Navbar;
