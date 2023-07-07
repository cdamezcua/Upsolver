import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";
import { Container, Typography } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <div className="App">
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes basename="/">
            <Route
              path="/"
              element={
                <Container
                  maxWidth="gx"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography variant="h2">
                    Welcome to Upsolver {user ? user.username : "Guest"}
                  </Typography>
                </Container>
              }
            />
            <Route
              path="login"
              element={
                <Container
                  maxWidth="gx"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <LoginForm />
                </Container>
              }
            />
            <Route
              path="signup"
              element={
                <Container
                  maxWidth="gx"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <SignupForm />
                </Container>
              }
            />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}
