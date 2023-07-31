import React from "react";
import { Box, Chip, Skeleton, Typography } from "@mui/material";
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
  Stack,
  Select,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ForumIcon from "@mui/icons-material/Forum";

export default function ProblemsTableSkeleton() {
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
            <Typography variant="h6">Training Camp México 2023</Typography>
          </Skeleton>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Skeleton>
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
            </Skeleton>
          </Stack>
        </Box>
        <Divider />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(new Array(10)).map((_, index) => (
              <TableRow>
                <TableCell>
                  <Skeleton>
                    <Chip label="DivX" />
                  </Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton>
                    <Select value="" />
                  </Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton>
                    <Select value="" />
                  </Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton>
                    <Select value="" />
                  </Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton>
                    <IconButton>
                      <ForumIcon />
                    </IconButton>
                  </Skeleton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
