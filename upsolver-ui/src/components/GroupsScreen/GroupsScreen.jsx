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
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { RANKING_COLORS } from "../../constants/config.js";
import { BACK_END_BASE_URL } from "../../constants/urls.js";
import TeamNavbar from "../TeamNavbar/TeamNavbar";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

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

  const [loadingCreateGroup, setLoadingCreateGroup] = React.useState(false);

  const [team, setTeam] = React.useState([]);
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

  const [groups, setGroups] = React.useState([]);
  async function fetchGroupsOfTeam() {
    try {
      const response = await fetch(
        BACK_END_BASE_URL + "/teams/" + teamId + "/groups",
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

  const [progresses, setProgresses] = React.useState([]);
  async function fetchProgressesOfMembers() {
    try {
      const response = await fetch(
        BACK_END_BASE_URL +
          "/teams/" +
          teamId +
          "/progresses?membership=contestant",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": user?.token,
          },
        }
      );
      const data = await response.json();
      setProgresses(data.progresses ?? []);
      console.log(data.progresses);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTeam();
    fetchGroupsOfTeam();
    fetchProgressesOfMembers();
  }, [user, teamId]);

  const [contestants, setContestants] = React.useState([]);
  useEffect(() => {
    async function fetchContestants() {
      try {
        const response = await fetch(
          BACK_END_BASE_URL +
            "/teams/" +
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

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [url, setUrl] = React.useState("");

  const handleCreateGroup = async () => {
    try {
      const response = await fetch(
        BACK_END_BASE_URL + "/teams/" + teamId + "/groups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": user?.token,
          },
          body: JSON.stringify({
            group_constructor: {
              url: url,
            },
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

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
            <Typography variant="h6">Groups</Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Fab
                variant="extended"
                size="medium"
                color="primary"
                aria-label="add"
                onClick={handleOpen}
              >
                <AddIcon sx={{ mr: 1 }} />
                Create Group
              </Fab>
            </Stack>
          </Box>
          <Divider />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {contestants.map((contestant) => (
                  <TableCell>
                    <Typography
                      noWrap
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                      color={RANKING_COLORS[contestant.rank]}
                    >
                      {contestant.username}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <Link to={`/team/${teamId}/group/${group.id}`}>
                      <Typography variant="h6" noWrap={true}>
                        {group.name}
                      </Typography>
                    </Link>
                  </TableCell>
                  {contestants.map((contestant) =>
                    progresses.find(
                      (progress) =>
                        progress.userId === contestant.id &&
                        progress.groupId === group.id
                    ) ? (
                      <TableCell sx={{ width: "100px" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <BorderLinearProgress
                            variant="determinate"
                            sx={{ flexGrow: 1 }}
                            value={
                              (100 *
                                (progresses.find(
                                  (progress) =>
                                    progress.userId === contestant.id &&
                                    progress.groupId === group.id
                                )?.numberOfSolvedProblems ?? 0)) /
                              (progresses.find(
                                (progress) =>
                                  progress.userId === contestant.id &&
                                  progress.groupId === group.id
                              )?.numberOfProblemsOfTeam ?? 0)
                            }
                          />
                          <Typography
                            variant="caption"
                            sx={{ textAlign: "center" }}
                          >
                            {(progresses.find(
                              (progress) =>
                                progress.userId === contestant.id &&
                                progress.groupId === group.id
                            )?.numberOfSolvedProblems ?? 0) +
                              " / " +
                              (progresses.find(
                                (progress) =>
                                  progress.userId === contestant.id &&
                                  progress.groupId === group.id
                              )?.numberOfProblemsOfTeam ?? 0)}
                          </Typography>
                        </Stack>
                      </TableCell>
                    ) : (
                      <TableCell />
                    )
                  )}

                  <TableCell>
                    <Typography variant="body1">{"[ BUTTON ]"}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setLoadingCreateGroup(true);
              await handleCreateGroup();
              console.log("Group created");
              fetchGroupsOfTeam();
              setLoadingCreateGroup(false);
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Create Group</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="URL"
                  variant="outlined"
                  fullWidth
                  required
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} sx={{ justifyContent: "end" }}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={loadingCreateGroup}
                  type="submit"
                >
                  Create
                </LoadingButton>
              </Stack>
            </Paper>
          </form>
        </Box>
      </Modal>
    </>
  );
}
