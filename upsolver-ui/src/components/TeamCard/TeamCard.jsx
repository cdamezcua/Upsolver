import React from "react";
import "./TeamCard.css";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function TeamCard({ team }) {
  return (
    <Card className="team-card">
      <CardActionArea>
        <Link
          to={`/team/${team.id}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            "&:hover, &:focus": {
              color: "inherit",
            },
          }}
        >
          <Box
            sx={{
              height: 140,
              bgcolor: "lightgray",
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {team.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {team.university}
            </Typography>
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  );
}
