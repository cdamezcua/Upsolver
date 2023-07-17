import React, { useEffect, useContext } from "react";
import "./TeamGrid.css";
import { Grid, Box } from "@mui/material";
import TeamCard from "../TeamCard/TeamCard";
import { UserContext } from "../../UserContext.js";

export default function TeamGrid() {
  const { user } = useContext(UserContext);

  const [teams, setTeams] = React.useState([]);

  useEffect(() => {
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
    fetchTeams();
  }, [user]);

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
            <TeamCard team={team} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
