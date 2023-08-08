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
import GroupsScreen from "../GroupsScreen/GroupsScreen";
import MembersScreen from "../MembersScreen/MembersScreen";
import InboxScreen from "../InboxScreen/InboxScreen";
import OutboxScreen from "../OutboxScreen/OutboxScreen";
import ProblemsTableScreen from "../ProblemsTableScreen/ProblemsTableScreen";
import { socket } from "../../socket";
import ProfileScreen from "../ProfileScreen/ProfileScreen";
import { BACK_END_BASE_URL } from "../../constants/urls.js";

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
    socket.auth = {
      token: user?.token,
    };
    socket.connect();
    socket.on("connect_error", (err) => {
      console.error("[!] Unable to connect to server", err.message);
    });
    return () => {
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    async function deletUserIfNotLoggedIn() {
      try {
        const response = await fetch(
          BACK_END_BASE_URL + "/users/is-logged-in",
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
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute
                  element={<Navigate to="/teams/my" replace={true} />}
                />
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
            <Route
              path="/teams/my"
              element={<ProtectedRoute element={<TeamsScreen />} />}
            />
            <Route
              path="/team/:teamId/groups"
              element={<ProtectedRoute element={<GroupsScreen />} />}
            />
            <Route
              path="/team/:teamId/group/:groupId"
              element={<ProtectedRoute element={<ProblemsTableScreen />} />}
            />
            <Route
              path="/team/:teamId/members"
              element={<ProtectedRoute element={<MembersScreen />} />}
            />
            <Route
              path="/team/:teamId/invitations"
              element={<ProtectedRoute element={<OutboxScreen />} />}
            />
            <Route
              path="/inbox"
              element={<ProtectedRoute element={<InboxScreen />} />}
            />
            <Route
              path="/profile/my"
              element={<ProtectedRoute element={<ProfileScreen />} />}
            />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}
