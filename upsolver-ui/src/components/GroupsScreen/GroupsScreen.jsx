import React from "react";
import "./GroupsScreen.css";
import Navbar from "../Navbar/Navbar";
import { Box, Divider, Typography } from "@mui/material";
import { Button, Stack } from "@mui/material";
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function GroupsScreen() {
  const teamId = window.location.pathname.split("/")[2];

  const { user } = useContext(UserContext);

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

  const [groups, setGroups] = React.useState([]);

  useEffect(() => {
    async function fetchGroupsOfTeam() {
      try {
        const response = await fetch(
          "http://localhost:3001/teams/" + teamId + "/groups",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": user?.token,
            },
          }
        );
        const data = await response.json();
        setGroups(data.groups ?? []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchGroupsOfTeam();
  }, [user]);

  return (
    <>
      <Navbar />
      <Typography
        variant="h6"
        sx={{
          height: "54px",
          m: "auto 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {team.name && team.university
          ? team.name + " - " + team.university
          : ""}
      </Typography>
      <Divider />
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
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Groups</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Progress</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell component="th" scope="row">
                    <Link
                      className="button-link"
                      to={`/team/${teamId}/group/${group.id}`}
                    >
                      <Typography variant="body1">{group.name}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      [////////-----------------------] 10 / 30 [PLACEHOLDER]
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
