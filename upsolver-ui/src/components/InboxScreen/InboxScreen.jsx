import React from "react";
import "./InboxScreen.css";
import Navbar from "../Navbar/Navbar";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { Button, Stack, Avatar } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { UserContext } from "../../UserContext.js";
import { useEffect, useContext } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import Subtitle from "../Subtitle/Subtitle";
import { RANKING_COLORS } from "../../constants/config.js";
import { BACK_END_BASE_URL } from "../../constants/urls.js";
import IncomingInvitationsSkeleton from "../IncomingInvitationsSkeleton/IncomingInvitationsSkeleton";

export default function InvoxScreen() {
  const [loading, setLoading] = React.useState(false);
  const { user } = useContext(UserContext);

  const [invitations, setInvitations] = React.useState([]);

  async function fetchInvitations() {
    try {
      const response = await fetch(BACK_END_BASE_URL + "/invitations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
      });
      const data = await response.json();
      setInvitations(data.invitations ?? []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  async function acceptInvitation(invitationId) {
    try {
      const response = await fetch(
        BACK_END_BASE_URL + "/invitations/" + invitationId + "/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": user?.token,
          },
        }
      );
      const data = await response.json();
      fetchInvitations();
    } catch (error) {
      console.log(error);
    }
  }

  async function rejectInvitation(invitationId) {
    try {
      const response = await fetch(
        BACK_END_BASE_URL + "/invitations/" + invitationId + "/reject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": user?.token,
          },
        }
      );
      const data = await response.json();
      fetchInvitations();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />
      <Subtitle>Inbox</Subtitle>
      {loading ? (
        <IncomingInvitationsSkeleton />
      ) : (
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
              <Typography variant="h6">pending Invitations</Typography>
              <IconButton
                onClick={async () => {
                  setLoading(true);
                  await fetchInvitations();
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  setLoading(false);
                }}
                size="large"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
            <Divider />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Inviter</TableCell>
                  <TableCell>Team</TableCell>
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
                      <Typography variant="body1">{invitation.team}</Typography>
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
                          color="success"
                          onClick={() => acceptInvitation(invitation.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => rejectInvitation(invitation.id)}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}
