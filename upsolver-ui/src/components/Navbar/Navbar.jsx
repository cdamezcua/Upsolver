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
  Typography,
} from "@mui/material";
import UserNavCard from "../UserNavCard/UserNavCard";
import { Link } from "react-router-dom";
import LogoutButton from "../LogoutButton/LogoutButton";
import InboxIcon from "@mui/icons-material/Inbox";
import { IconButton } from "@mui/material";

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
          <IconButton color="inherit" sx={{ marginRight: "10px" }} size="large">
            <Link className="button-link" to="/inbox">
              <InboxIcon />
            </Link>
          </IconButton>
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
              <Link to="/profile/my" className="button-link">
                <ButtonBase>
                  <Typography textAlign="center" color="black">
                    Profile
                  </Typography>
                </ButtonBase>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              <LogoutButton />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
