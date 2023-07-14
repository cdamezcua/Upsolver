import React from "react";
import "./TeamsScreen.css";
import Navbar from "../Navbar/Navbar";
import TeamGrid from "../TeamGrid/TeamGrid";
import Subtitle from "../Subtitle/Subtitle";

export default function TeamsScreen() {
  return (
    <div className="teams-screen-container">
      <Navbar />
      <Subtitle>
        My Teams
      </Subtitle>
      <TeamGrid />
    </div>
  );
}
