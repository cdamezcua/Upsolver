import React, { useEffect, useContext } from "react";
import "./OutboxScreen.css";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserContext.js";
import Subtitle from "../Subtitle/Subtitle";
import AddIcon from "@mui/icons-material/Add";
import { RANKING_COLORS } from "../../constants/config.js";
import {
  Box,
  Divider,
  Typography,
  Button,
  Stack,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
} from "@mui/material";

export default function OutboxScreen() {
  const { user } = useContext(UserContext);

  const teamId = window.location.pathname.split("/")[2];

  const [team, setTeam] = React.useState([]);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch("http://localhost:3001/teams/" + teamId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": user?.token,
          },
        });
        const data = await response.json();
        setTeam(data.team ?? {});
      } catch (error) {
        console.log(error);
      }
    }
    fetchTeam();
  }, [user, teamId]);

  const [invitations, setInvitations] = React.useState([]);

  async function fetchInvitations() {
    try {
      const response = await fetch(
        "http://localhost:3001/teams/" + teamId + "/invitations",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": user?.token,
          },
        }
      );
      const data = await response.json();
      setInvitations(data.invitations ?? []);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchInvitations();
  }, [user, teamId]);

  async function cancelInvitation(invitationId) {
    try {
      await fetch(
        "http://localhost:3001/teams/" +
          teamId +
          "/invitations/" +
          invitationId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": user?.token,
          },
        }
      );
      fetchInvitations();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />
      <Subtitle>
        {team.name && team.university
          ? team.name + " - " + team.university
          : ""}
      </Subtitle>
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
      <Box sx={{ m: "20px" }}>
        <TableContainer component={Paper}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              m: "20px",
            }}
          >
            <Typography variant="h6">Outgoing Invitations</Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Fab
                variant="extended"
                size="medium"
                color="primary"
                aria-label="add"
                onClick={() => {}}
              >
                <AddIcon sx={{ mr: 1 }} />
                Invite User
              </Fab>
            </Stack>
          </Box>
          <Divider />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Inviter</TableCell>
                <TableCell>Invitee</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Invited On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>
                    <Stack direction="row" spacing="16px" alignItems="center">
                      <Avatar
                        alt={invitation.inviterUsername[0]}
                        src={invitation.inviterAvatar}
                        variant="square"
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body1" noWrap>
                          {invitation.inviterName}
                        </Typography>
                        <Typography
                          noWrap
                          variant="subtitle2"
                          color={RANKING_COLORS[invitation.inviterRank]}
                        >
                          {invitation.inviterUsername}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing="16px" alignItems="center">
                      <Avatar
                        alt={invitation.inviteeUsername[0]}
                        src={invitation.inviteeAvatar}
                        variant="square"
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body1" noWrap>
                          {invitation.inviteeName}
                        </Typography>
                        <Typography
                          noWrap
                          variant="subtitle2"
                          color={RANKING_COLORS[invitation.inviteeRank]}
                        >
                          {invitation.inviteeUsername}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{invitation.role}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {new Date(invitation.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          cancelInvitation(invitation.id);
                        }}
                      >
                        Cancel Invitation
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
