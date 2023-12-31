import React from "react";
import "./MembersScreen.css";
import Navbar from "../Navbar/Navbar";
import { Box, Divider, Typography } from "@mui/material";
import { Button, Stack, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
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
import Subtitle from "../Subtitle/Subtitle";
import { RANKING_COLORS } from "../../constants/config.js";
import { BACK_END_BASE_URL } from "../../constants/urls.js";
import TeamNavbar from "../TeamNavbar/TeamNavbar";

export default function MembersScreen() {
  const { user } = useContext(UserContext);

  const teamId = window.location.pathname.split("/")[2];

  const [team, setTeam] = React.useState([]);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch(BACK_END_BASE_URL + "/teams/" + teamId, {
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
  }, [user]);

  const [members, setMembers] = React.useState([]);

  useEffect(() => {
    async function fetchMembersOfTeam() {
      try {
        const response = await fetch(
          BACK_END_BASE_URL + "/teams/" + teamId + "/members",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": user?.token,
            },
          }
        );
        const data = await response.json();
        const members = data.members ?? [];
        setMembers(members);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMembersOfTeam();
  }, [user]);

  return (
    <>
      <Navbar />
      <Subtitle>
        {team.name && team.university
          ? team.name + " - " + team.university
          : ""}
      </Subtitle>
      <TeamNavbar teamId={teamId} />
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
            <Typography variant="h6">Team Members</Typography>
          </Box>
          <Divider />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Member Since</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Stack direction="row" spacing="16px" alignItems="center">
                      <Avatar
                        alt={user.name[0]}
                        src={user.avatar}
                        variant="square"
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body1" noWrap>
                          {user.name}
                        </Typography>
                        <Typography
                          noWrap
                          variant="subtitle2"
                          color={RANKING_COLORS[user.rank]}
                        >
                          {user.username}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{user.role}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
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
