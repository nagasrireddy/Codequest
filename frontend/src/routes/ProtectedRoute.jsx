import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  return children; // DEV ONLY — auth gate off so pages load without the backend
}