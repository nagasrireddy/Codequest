import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">{"</>"}</span>
          <span className="brand-name">CodeQuest</span>
        </Link>

        <nav className="nav-links">
          {token && <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>}
          {token && <NavLink to="/arena" className="nav-link">Arena</NavLink>}
          {token && <NavLink to="/leaderboard" className="nav-link">Leaderboard</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          {token ? (
            <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}