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
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { UserContext } from "../../UserContext.js";
import { useEffect, useContext } from "react";
import Subtitle from "../Subtitle/Subtitle";
import AddIcon from "@mui/icons-material/Add";
import { DIVISION_COLORS } from "../../constants/config";
import ForumIcon from "@mui/icons-material/Forum";
import ChatDialog from "../ChatDialog/ChatDialog";

export default function ProblemsTableScreen() {
  const { user } = useContext(UserContext);
  const teamId = window.location.pathname.split("/")[2];
  const groupId = window.location.pathname.split("/")[4];

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

  const [group, setGroup] = React.useState({});
  useEffect(() => {
    async function fetchGroup() {
      try {
        const response = await fetch(
          "http://localhost:3001/teams/" + teamId + "/groups/" + groupId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": user?.token,
            },
          }
        );
        const data = await response.json();
        setGroup(data.group ?? {});
      } catch (error) {
        console.log(error);
      }
    }
    fetchGroup();
  }, [user, teamId, groupId]);

  const [contestsProblems, setContestsProblems] = React.useState([]);
  useEffect(() => {
    async function fetchContestsProblems() {
      try {
        const response = await fetch(
          "http://localhost:3001/teams/" +
            teamId +
            "/groups/" +
            groupId +
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
  }, [user, teamId, groupId]);

  const [contestants, setContestants] = React.useState([]);
  useEffect(() => {
    async function fetchContestants() {
      try {
        const response = await fetch(
          "http://localhost:3001/teams/" +
            teamId +
            "/members?membership=contestant",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": user?.token,
            },
          }
        );
        const data = await response.json();
        setContestants(data.members ?? []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchContestants();
  }, [user, teamId]);

  const [submissions, setSubmissions] = React.useState([]);
  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch(
          "http://localhost:3001/teams/" +
            teamId +
            "/groups/" +
            groupId +
            "/submissions?membership=contestant",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": user?.token,
            },
          }
        );
        const data = await response.json();
        setSubmissions(data.submissions ?? []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSubmissions();
  }, [user, teamId, groupId]);

  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [activeContestProblem, setActiveContestProblem] = React.useState({});

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
            <Typography variant="h6">{group.name ? group.name : ""}</Typography>
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
                {contestants.map((contestant) => (
                  <TableCell
                    key={contestant.id}
                    sx={{ width: "100px", textAlign: "center" }}
                  >
                    {contestant.username}
                  </TableCell>
                ))}
                <TableCell>Problem Solved Count</TableCell>
                <TableCell>Chat</TableCell>
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
                  {contestants.map((contestant) => (
                    <TableCell key={contestProblem.problemId + contestant.id}>
                      {submissions
                        .filter(
                          (submission) =>
                            submission.problemId === contestProblem.problemId &&
                            submission.userId === contestant.id
                        )
                        .map((submission) => (
                          <FormControl
                            fullWidth
                            key={submission.userId + "-" + submission.problemId}
                            size="small"
                          >
                            <Select
                              sx={{
                                textAlign: "center",
                                backgroundColor:
                                  submission.veredict === "AC"
                                    ? "#4caf50"
                                    : submission.veredict === "WA"
                                    ? "#f44336"
                                    : submission.veredict === "TLE"
                                    ? "#ff9800"
                                    : "inherit",
                              }}
                              defaultValue={""}
                              value={submission.veredict ?? ""}
                              onChange={(event) => {
                                setSubmissions(
                                  submissions.map((submission) => {
                                    if (
                                      submission.problemId ===
                                        contestProblem.problemId &&
                                      submission.userId === contestant.id
                                    ) {
                                      submission.veredict = event.target.value;
                                    }
                                    return submission;
                                  })
                                );
                                async function updateVeredict() {
                                  try {
                                    const response = await fetch(
                                      "http://localhost:3001/teams/" +
                                        teamId +
                                        "/groups/" +
                                        groupId +
                                        "/submissions/" +
                                        "?userId=" +
                                        contestant.id +
                                        "&problemId=" +
                                        contestProblem.problemId,
                                      {
                                        method: "PATCH",
                                        headers: {
                                          "Content-Type": "application/json",
                                          "x-access-token": user?.token,
                                        },
                                        body: JSON.stringify({
                                          veredict: event.target.value,
                                        }),
                                      }
                                    );
                                    const data = await response.json();
                                    console.log(data);
                                  } catch (error) {
                                    console.log(error);
                                  }
                                }
                                updateVeredict();
                              }}
                            >
                              <MenuItem value={""}>
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value={"AC"}>AC</MenuItem>
                              <MenuItem value={"WA"}>WA</MenuItem>
                              <MenuItem value={"TLE"}>TLE</MenuItem>
                            </Select>
                          </FormControl>
                        ))}
                    </TableCell>
                  ))}
                  <TableCell>{contestProblem.problemSolvedCount}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setActiveContestProblem(contestProblem);
                        setIsChatOpen(true);
                      }}
                    >
                      <ForumIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <ChatDialog
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        activeContestProblem={activeContestProblem}
        setActiveContestProblem={setActiveContestProblem}
      />
    </>
  );
}
