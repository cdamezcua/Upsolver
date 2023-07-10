import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function ProtectedRoute({ element }) {
  const { user } = useContext(UserContext);

  return user ? element : <Navigate to="/login" replace={true} />;
}
