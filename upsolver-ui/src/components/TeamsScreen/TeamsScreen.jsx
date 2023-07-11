import React from "react";
import "./TeamsScreen.css";
import Navbar from "../Navbar/Navbar";
import TeamGrid from "../TeamGrid/TeamGrid";

export default function TeamsScreen() {
  return (
    <div className="teams-screen-container">
      <Navbar />
      <TeamGrid />
    </div>
  );
}
