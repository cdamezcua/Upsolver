import React from "react";
import "./ProfileScreen.css";
import Navbar from "../Navbar/Navbar";
import { Box } from "@mui/material";
import { UserContext } from "../../UserContext.js";
import { useContext } from "react";
import Subtitle from "../Subtitle/Subtitle";
import UserCard from "../UserCard/UserCard";

export default function ProfileScreen() {
  const { user } = useContext(UserContext);

  return (
    <>
      <Navbar />
      <Subtitle>Profile</Subtitle>

      <Box sx={{ m: "50px", display: "flex", justifyContent: "center" }}>
        <UserCard />
      </Box>
    </>
  );
}
