import React from "react";
import "./TeamGrid.css";
import { Grid, Box } from "@mui/material";
import TeamCard from "../TeamCard/TeamCard";

export default function TeamGrid({ teams }) {
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
