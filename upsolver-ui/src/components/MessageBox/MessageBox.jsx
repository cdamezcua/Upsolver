import React, { useContext } from "react";
import "./MessageBox.css";
import { Box, Typography } from "@mui/material";
import { Paper } from "@mui/material";
import { RANKING_COLORS } from "../../constants/config";
import { UserContext } from "../../UserContext";

export default function MessageBox({ message }) {
  const { user } = useContext(UserContext);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent:
          message.sender === user.username ? "flex-end" : "flex-start",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Paper
        sx={{
          p: 2,
          mb: 2,
          backgroundColor:
            message.sender === user.username ? "primary.main" : "white",
        }}
      >
        {message.sender !== user.username ? (
          <Typography
            variant="caption"
            color={RANKING_COLORS[message.senderRank]}
          >
            {message.sender}
          </Typography>
        ) : null}
        <Typography
          variant="body1"
          color={
            message.sender === user.username
              ? "primary.contrastText"
              : "text.primary"
          }
        >
          {message.content}
        </Typography>
      </Paper>
    </Box>
  );
}
