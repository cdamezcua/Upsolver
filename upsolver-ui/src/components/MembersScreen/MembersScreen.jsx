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

export default function MembersScreen() {
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
  }, [user]);

  const [members, setMembers] = React.useState([]);

  useEffect(() => {
    async function fetchMembersOfTeam() {
      try {
        const response = await fetch(
          "http://localhost:3001/teams/" + teamId + "/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": user?.token,
            },
          }
        );
        const members = await response.json();
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
      <Stack spacing={2} direction="row" sx={{ m: "20px" }}>
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
      </Stack>
      <Box sx={{ m: "20px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {members.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar variant="square" sx={{ width: 100, height: 100 }}>
                      {user.name[0]}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="h6">{user.name}</Typography>
                      <Typography variant="subtitle1">
                        {user.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">{user.role}</Typography>
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
