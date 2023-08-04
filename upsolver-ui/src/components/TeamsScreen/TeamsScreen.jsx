import React, { useEffect, useContext } from "react";
import "./TeamsScreen.css";
import Navbar from "../Navbar/Navbar";
import TeamGrid from "../TeamGrid/TeamGrid";
import Subtitle from "../Subtitle/Subtitle";
import {
  Fab,
  Modal,
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { UserContext } from "../../UserContext.js";
import { BACK_END_BASE_URL } from "../../constants/urls.js";

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

export default function TeamsScreen() {
  const { user } = useContext(UserContext);

  const [teams, setTeams] = React.useState([]);

  async function fetchTeams() {
    try {
      const response = await fetch(BACK_END_BASE_URL + "/teams", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
      });
      const data = await response.json();
      setTeams(data.teams ?? []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTeams();
  }, [user]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [role, setRole] = React.useState("");
  const [name, setName] = React.useState("");
  const [university, setUniversity] = React.useState("");

  async function handleCreateTeam() {
    try {
      const response = await fetch(BACK_END_BASE_URL + "/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify({
          name: name,
          university: university,
          role: role,
        }),
      });
      const data = await response.json();
      console.log(data);
      fetchTeams();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="teams-screen-container">
      <Navbar />
      <Subtitle>My Teams</Subtitle>
      <TeamGrid teams={teams} />
      <Fab className="create-team-button" color="primary" onClick={handleOpen}>
        <AddIcon />
      </Fab>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateTeam();
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Create Team</Typography>
              <Divider sx={{ my: 2 }} />
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="University"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
              <Alert severity="info" sx={{ mb: 2 }}>
                After creating this team, you will become a member of it.
              </Alert>
              <FormControl fullWidth required>
                <InputLabel>Join as</InputLabel>
                <Select
                  label="Join as"
                  defaultValue={""}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value={"contestant"}>contestant</MenuItem>
                  <MenuItem value={"coach"}>coach</MenuItem>
                </Select>
              </FormControl>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} sx={{ justifyContent: "end" }}>
                <Button variant="contained" color="primary" type="submit">
                  Create
                </Button>
              </Stack>
            </Paper>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
