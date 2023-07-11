import * as React from "react";
import "./Logo.css";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function Logo({ to }) {
  return (
    <Typography
      variant="h4"
      component="div"
      sx={{
        variant: "h4",
        fontFamily: "Raleway",
        fontWeight: 700,
        marginRight: 2,
      }}
    >
      <Link to={to} className="logo-link">
        Upsolver
      </Link>
    </Typography>
  );
}
