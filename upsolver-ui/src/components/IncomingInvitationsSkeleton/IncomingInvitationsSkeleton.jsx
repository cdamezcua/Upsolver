import React from "react";
import "./IncomingInvitationsSkeleton.css";
import { Box, Skeleton, Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Stack,
  IconButton,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function IncomingInvitationsSkeleton() {
  return (
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
          <Skeleton>
            <Typography variant="h6">pending Invitations</Typography>
          </Skeleton>
          <Skeleton variant="circular">
            <IconButton size="large">
              <RefreshIcon />
            </IconButton>
          </Skeleton>
        </Box>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton>
                  <Typography variant="h6">Inviter</Typography>
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton>
                  <Typography variant="h6">Team</Typography>
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton>
                  <Typography variant="h6">Role</Typography>
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton>
                  <Typography variant="h6">Invited On</Typography>
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton>
                  <Typography variant="h6">Actions</Typography>
                </Skeleton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(new Array(5)).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Stack direction="row" spacing="16px" alignItems="center">
                    <Skeleton variant="square" width={50} height={50} />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Skeleton>
                        <Typography variant="body1" noWrap>
                          Long Inviter Name
                        </Typography>
                      </Skeleton>
                      <Skeleton>
                        <Typography noWrap variant="subtitle2">
                          Username
                        </Typography>
                      </Skeleton>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Skeleton>
                    <Typography variant="body1">Long Team Name</Typography>
                  </Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton>
                    <Typography variant="body1">Role Name</Typography>
                  </Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton>
                    <Typography variant="body1">00/00/0000</Typography>
                  </Skeleton>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Skeleton>
                      <Button variant="contained" color="success">
                        Accept
                      </Button>
                    </Skeleton>
                    <Skeleton>
                      <Button variant="contained" color="error">
                        Reject
                      </Button>
                    </Skeleton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
