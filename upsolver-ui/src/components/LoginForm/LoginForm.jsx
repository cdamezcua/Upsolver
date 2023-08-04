import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.js";
import "./LoginForm.css";
import Logo from "../Logo/Logo";
import { Paper, Box, Typography, TextField, Button } from "@mui/material";
import { BACK_END_BASE_URL } from "../../constants/urls.js";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(BACK_END_BASE_URL + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.user) {
        updateUser(data.user);
        navigate("/teams/my");
      } else {
        alert("[!] Login failed");
      }
    } catch (err) {
      console.error("[!] Login failed", err.message);
    }
  };

  return (
    <Paper className="login-form-container" elevation={24} sx={{ p: 4 }}>
      <form onSubmit={handleLogin}>
        <Box className="logo-container">
          <Logo variant="h3" />
        </Box>
        <Typography variant="h4" component="h1">
          Log In
        </Typography>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Log In
        </Button>
        <Typography variant="body1" component="p">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </form>
    </Paper>
  );
}
