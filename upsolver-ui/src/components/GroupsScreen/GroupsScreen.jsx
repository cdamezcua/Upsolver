import React from "react";
import "./GroupsScreen.css";
import Navbar from "../Navbar/Navbar";
import { Box, Typography } from "@mui/material";
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
  Divider,
  Fab,
  Modal,
  TextField,
} from "@mui/material";
import { UserContext } from "../../UserContext.js";
import { useEffect, useContext } from "react";
import Subtitle from "../Subtitle/Subtitle";
import AddIcon from "@mui/icons-material/Add";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
  }, [user, teamId]);

  const [groups, setGroups] = React.useState([]);

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

  useEffect(() => {
    fetchGroupsOfTeam();
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
        <Button variant="contained" color="primary" className="page-button">
          <Link className="button-link" to={`/team/${teamId}/invitations`}>
            Invitations
          </Link>
        </Button>
      </Stack>
      <Box sx={{ m: "20px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Group</Typography>
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
