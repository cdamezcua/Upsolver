import React from "react";
import "./TeamNavbar.css";
import { Link } from "react-router-dom";
import { Stack, Button } from "@mui/material";

export default function TeamNavbar({ teamId }) {
  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{ m: "20px" }}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary" className="page-button">
          <Link className="button-link" to={`/team/${teamId}/groups`}>
            Groups
          </Link>
        </Button>
        <Button variant="contained" color="primary" className="page-button">
          <Link className="button-link" to={`/team/${teamId}/members`}>
            Members
          </Link>
        </Button>
        <Button variant="contained" color="primary" className="page-button">
          <Link className="button-link" to={`/team/${teamId}/invitations`}>
            Invitations
          </Link>
        </Button>
      </Stack>
    </Stack>
  );
}
