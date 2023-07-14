import React from "react";
import "./TeamsScreen.css";
import Navbar from "../Navbar/Navbar";
import TeamGrid from "../TeamGrid/TeamGrid";
import Subtitle from "../Subtitle/Subtitle";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function TeamsScreen() {
  return (
    <div className="teams-screen-container">
      <Navbar />
      <Subtitle>My Teams</Subtitle>
      <TeamGrid />
      <Fab
        className="create-team-button"
        color="primary"
        onClick={() => console.log("create team")}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
