import React from "react";
import "./ProblemsTableScreen.css";
import Navbar from "../Navbar/Navbar";
import { Box, Chip, Typography } from "@mui/material";
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
  Button,
  Stack,
} from "@mui/material";
import { UserContext } from "../../UserContext.js";
import { useEffect, useContext } from "react";
import Subtitle from "../Subtitle/Subtitle";
import AddIcon from "@mui/icons-material/Add";
import { DIVISION_COLORS } from "../../constants/config";

export default function ProblemsTableScreen() {
  const teamId = window.location.pathname.split("/")[2];
  const groupsId = window.location.pathname.split("/")[4];

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

  const [contestsProblems, setContestsProblems] = React.useState([]);

  useEffect(() => {
    async function fetchContestsProblems() {
      try {
        const response = await fetch(
          "http://localhost:3001/teams/" +
            teamId +
            "/groups/" +
            groupsId +
            "/contests/problems",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": user?.token,
            },
          }
        );
        const data = await response.json();
        setContestsProblems(data.contestsProblems ?? []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchContestsProblems();
  }, [user, teamId, groupsId]);

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
            <Typography variant="h6">Training Camp México 2023**</Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Fab
                variant="extended"
                size="medium"
                color="primary"
                aria-label="add"
                onClick={() => {}}
              >
                <AddIcon sx={{ mr: 1 }} />
                Add Contest
              </Fab>
            </Stack>
          </Box>
          <Divider />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Contest Division</TableCell>
                <TableCell>Contest Number</TableCell>
                <TableCell>Contest Name</TableCell>
                <TableCell>Problem Number</TableCell>
                <TableCell>Problem Name</TableCell>
                <TableCell>Problem Solved Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contestsProblems.map((contestProblem) => (
                <TableRow key={contestProblem.problemId}>
                  <TableCell>
                    <Chip
                      color={DIVISION_COLORS[contestProblem.contestDivision]}
                      label={contestProblem.contestDivision}
                    />
                  </TableCell>
                  <TableCell>{contestProblem.contestNumber}</TableCell>
                  <TableCell>
                    <Link to={contestProblem.contestURL}>
                      {contestProblem.contestName}
                    </Link>
                  </TableCell>
                  <TableCell>{contestProblem.problemNumber}</TableCell>
                  <TableCell>
                    <Link to={contestProblem.problemURL}>
                      {contestProblem.problemName}
                    </Link>
                  </TableCell>
                  <TableCell>{contestProblem.problemSolvedCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
