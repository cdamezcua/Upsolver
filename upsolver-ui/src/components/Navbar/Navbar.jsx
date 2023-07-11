import React from "react";
import "./Navbar.css";
import Logo from "../Logo/Logo";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  ButtonBase,
} from "@mui/material";
import UserNavCard from "../UserNavCard/UserNavCard";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="navbar-container">
      <AppBar position="static">
        <Toolbar className="navbar">
          <Logo to="/teams/my" />
          <Box className="pages-container">
            <Button className="page-button" color="inherit">
              <Link className="button-link" to="/teams/my">
                Teams
              </Link>
            </Button>
            <Button className="page-button" color="inherit">
              <Link className="button-link" to="/problemset">
                Problemset
              </Link>
            </Button>
          </Box>
          <ButtonBase onClick={handleOpenUserMenu}>
            <UserNavCard />
          </ButtonBase>
          <Menu
            sx={{ mt: "5px" }}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <button>PLACEHOLDER</button>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}