import React from "react";
import "./LoginScreen.css";
import { Box, Container } from "@mui/material";
import LoginForm from "../LoginForm/LoginForm";

export default function LoginScreen() {
  return (
    <Box
      className="login-screen-container"
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "primary.main",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <LoginForm />
    </Box>
  );
}
