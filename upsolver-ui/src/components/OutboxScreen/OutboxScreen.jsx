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
  Select,
  TextField,
  Modal,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setInvitee(null);
  };

  const [users, setUsers] = React.useState([]);

  async function fetchUsers() {
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
      });
      const data = await response.json();
      setUsers(data.users ?? []);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const [invitee, setInvitee] = React.useState(null);

  const [role, setRole] = React.useState("contestant");

  async function handleSendInvitation() {
    try {
      const response = await fetch(
        "http://localhost:3001/teams/" + teamId + "/invitations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": user?.token,
          },
          body: JSON.stringify({
            inviteeUsername: invitee.label,
            role: role,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
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
                onClick={() => {
                  fetchUsers();
                  handleOpen();
                }}
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
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Invite User</Typography>
            <Divider sx={{ my: 2 }} />
            <Autocomplete
              fullWidth
              disablePortal
              id="combo-box-demo"
              options={users}
              sx={{ mb: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="username" />
              )}
              defaultValue={""}
              value={invitee}
              onChange={(e, newValue) => setInvitee(newValue)}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Role"
                defaultValue={"contestant"}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value={"contestant"}>contestant</MenuItem>
                <MenuItem value={"coach"}>coach</MenuItem>
              </Select>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2} sx={{ justifyContent: "end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleSendInvitation();
                }}
              >
                Send Invitation
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Modal>
    </>
  );
}
