import React, { useContext } from "react";
import "./LogoutButton.css";
import { UserContext } from "../../UserContext.js";
import { ButtonBase, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { BACK_END_BASE_URL } from "../../constants/urls.js";

export default function LogoutButton() {
  const { user, updateUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await fetch(BACK_END_BASE_URL + "/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
      });
      if (response.status === 200) {
        updateUser(null);
        <Navigate to="/login" replace={true} />;
        console.log("Logout successful");
      } else {
        console.error("[!] Logout failed", response.status);
      }
    } catch (err) {
      console.error("[!] Logout failed", err.message);
    }
  };

  return (
    <ButtonBase onClick={handleLogout}>
      <Typography textAlign="center">Log out</Typography>
    </ButtonBase>
  );
}
