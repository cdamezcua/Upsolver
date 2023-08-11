import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.js";
import "./LoginForm.css";
import Logo from "../Logo/Logo";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Divider,
  Alert,
  Collapse,
} from "@mui/material";
import { BACK_END_BASE_URL } from "../../constants/urls.js";
import { LoadingButton } from "@mui/lab";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { updateUser } = useContext(UserContext);

  const [isLoading, setIsLoading] = React.useState(false);

  const [isThereAlert, setIsThereAlert] = React.useState(false);
  const [accessGranted, setAccessGranted] = React.useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
      setIsLoading(true);
      setIsThereAlert(false);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await fetch(BACK_END_BASE_URL + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (response.ok) {
        setAccessGranted(true);
      }
      setIsThereAlert(true);
      const data = await response.json();
      if (data.user) {
        updateUser(data.user);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/teams/my");
      }
      setIsLoading(false);
    } catch (err) {
      console.error("[!] Login failed", err.message);
    }
  };

  return (
    <Paper className="login-form-container" elevation={24} sx={{ p: 4 }}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleLogin();
        }}
      >
        <Box className="logo-container">
          <Logo variant="h3" />
        </Box>
        <Typography variant="h4" component="h1">
          Log In
        </Typography>
        <Divider sx={{ my: 2 }} />
        <TextField
          sx={{ mt: 0, mb: 2 }}
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
          sx={{ my: 0 }}
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
        <Divider sx={{ my: 2 }} />
        <LoadingButton
          variant="contained"
          color="primary"
          loading={isLoading}
          type="submit"
          fullWidth
        >
          Log In
        </LoadingButton>
        <Collapse in={isThereAlert}>
          {accessGranted ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Access granted! — <strong>redirecting...</strong>
            </Alert>
          ) : (
            <Alert severity="error" sx={{ mt: 2 }}>
              Invalid credentials
            </Alert>
          )}
        </Collapse>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" component="p">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </form>
    </Paper>
  );
}
