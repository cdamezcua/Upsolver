import React from "react";
import "./Subtitle.css";
import { Typography, Divider } from "@mui/material";

export default function Navbar(props) {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          height: "54px",
          m: "auto 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {props.children}
      </Typography>
      <Divider />
    </>
  );
}
