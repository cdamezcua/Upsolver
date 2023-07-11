import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";
import { Container } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.jsx";
import TeamsScreen from "../TeamsScreen/TeamsScreen";

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

  useEffect(() => {
    async function deletUserIfNotLoggedIn() {
      try {
        const response = await fetch(
          "http://localhost:3001/users/is-logged-in",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": user?.token,
            },
          }
        );
        const data = await response.json();
        console.log("isLoggedIn response: ", data);
        if (data.isLoggedIn === false) {
          updateUser(null);
        }
      } catch (err) {
        console.error("[!] Unable to verify login status", err.message);
      }
    }
    deletUserIfNotLoggedIn();
  }, [user]);

  return (
    <div className="App">
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes basename="/">
            <Route
              path="/"
              element={
                <ProtectedRoute
                  element={<Navigate to="/teams/my" replace={true} />}
                />
              }
            />
            <Route
              path="/teams/my"
              element={<ProtectedRoute element={<TeamsScreen />} />}
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
