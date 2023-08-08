import React from "react";
import "./TeamNavbar.css";
import { Link } from "react-router-dom";
import { Stack, Button } from "@mui/material";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

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
        <Link className="button-link" to={`/team/${teamId}/groups`}>
          <Button variant="contained" color="primary" className="page-button">
            Groups
          </Button>
        </Link>
        <Link className="button-link" to={`/team/${teamId}/members`}>
          <Button variant="contained" color="primary" className="page-button">
            Members
          </Button>
        </Link>
        <Link className="button-link" to={`/team/${teamId}/invitations`}>
          <Button variant="contained" color="primary" className="page-button">
            Invitations
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
}
