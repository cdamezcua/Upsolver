import * as React from "react";
import "./Logo.css";
import { Typography } from "@mui/material";

export default function Logo({ variant = "h4" }) {
  return (
    <Typography
      variant={variant}
      component="div"
      sx={{
        fontFamily: "Raleway",
        fontWeight: 700,
        marginRight: 2,
      }}
    >
      Upsolver
    </Typography>
  );
}
