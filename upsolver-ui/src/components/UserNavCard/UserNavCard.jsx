import React, { useContext } from "react";
import "./UserNavCard.css";
import { Box, Avatar, Typography } from "@mui/material";
import { UserContext } from "../../UserContext.js";

export default function UserNavCard() {
  const { user } = useContext(UserContext);

  return (
    <Box className="user-nav-card-container">
      <Box className="avatar-container">
        <Avatar variant="square">{user.username[0]}</Avatar>
      </Box>
      <Typography className="username" variant="h6" color="text.primary">{user.username}</Typography>
    </Box>
  );
}
