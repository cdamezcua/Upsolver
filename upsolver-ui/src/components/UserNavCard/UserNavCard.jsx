import React, { useContext } from "react";
import "./UserNavCard.css";
import { Box, Avatar, Typography } from "@mui/material";
import { UserContext } from "../../UserContext.js";
import { RANKING_COLORS } from "../../constants/config.js";

export default function UserNavCard() {
  const { user } = useContext(UserContext);
  return (
    <Box className="user-nav-card-container">
      <Box className="avatar-container">
        <Avatar alt={user.username} src={user.avatar} variant="square" />
      </Box>
      <Typography
        className="username"
        variant="h6"
        color={RANKING_COLORS[user.rank]}
      >
        {user.username}
      </Typography>
    </Box>
  );
}
