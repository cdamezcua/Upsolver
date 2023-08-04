import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.js";
import "./SignupForm.css";
import Logo from "../Logo/Logo";
import { Paper, Box, Typography, TextField, Button } from "@mui/material";
import { BACK_END_BASE_URL } from "../../constants/urls.js";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfHandle, setCfHandle] = useState("");
  const [name, setName] = useState("");

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(BACK_END_BASE_URL + "/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, cfHandle, name }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.user) {
        updateUser(data.user);
        navigate("/teams/my");
      } else {
        alert("[!] Signup failed");
      }
    } catch (err) {
      console.error("[!] Signup failed", err.message);
    }
  };
  return (
    <Paper className="signup-form-container" elevation={24} sx={{ p: 4 }}>
      <form onSubmit={handleSignup}>
        <Box className="logo-container">
          <Logo variant="h3" />
        </Box>
        <Typography variant="h4" component="h1">
          Sign Up
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
          id="email"
          label="Email"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          id="cfHandle"
          label="Codeforces Handle"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          autoFocus
          value={cfHandle}
          onChange={(e) => setCfHandle(e.target.value)}
        />
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          margin="normal"
          fullWidth
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
        <Typography variant="body1" component="p">
          Already have an account? <Link to="/login">Log In</Link>
        </Typography>
      </form>
    </Paper>
  );
}
