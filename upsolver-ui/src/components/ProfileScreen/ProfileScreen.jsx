import React from "react";
import "./ProfileScreen.css";
import Navbar from "../Navbar/Navbar";
import { Box, Typography } from "@mui/material";
import { Paper, Grid } from "@mui/material";
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
      <Box sx={{ m: "50px" }}>
        <Grid container>
          <Grid
            Paper
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <UserCard />
          </Grid>
          <Grid Paper xs={8}>
            <Paper>
              <Typography variant="h6">Country: {user.country}</Typography>
              <Typography variant="h6">City: {user.city}</Typography>
              <Typography variant="h6">Email: {user.email}</Typography>
            </Paper>
          </Grid>
          <Grid Paper xs={4}>
            <Paper></Paper>
          </Grid>
          <Grid Paper xs={8}>
            <Paper></Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
