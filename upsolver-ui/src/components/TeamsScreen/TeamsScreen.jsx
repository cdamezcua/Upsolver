import React, { useEffect, useContext } from "react";
import "./TeamsScreen.css";
import Navbar from "../Navbar/Navbar";
import TeamGrid from "../TeamGrid/TeamGrid";
import Subtitle from "../Subtitle/Subtitle";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { UserContext } from "../../UserContext.js";

export default function TeamsScreen() {
  const { user } = useContext(UserContext);

  const [teams, setTeams] = React.useState([]);

  async function fetchTeams() {
    try {
      const response = await fetch("http://localhost:3001/teams", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
      });
      const data = await response.json();
      setTeams(data.teams ?? []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTeams();
  }, [user]);

  return (
    <div className="teams-screen-container">
      <Navbar />
      <Subtitle>My Teams</Subtitle>
      <TeamGrid teams={teams} />
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
