import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as leaderboardService from "../services/leaderboardService";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalScore: 0, rank: null });

  useEffect(() => {
    leaderboardService.getMyRank()
      .then(({ data }) => setStats({ totalScore: data.totalScore, rank: data.rank }))
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard">
      <header className="dash-head">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="dash-title">Hi {user?.name?.split(" ")[0] || "there"} 👋</h1>
        </div>
      </header>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total score</span>
          <span className="stat-value">{stats.totalScore}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Global rank</span>
          <span className="stat-value">{stats.rank ? `#${stats.rank}` : "—"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Role</span>
          <span className="stat-value stat-value-sm">{user?.role}</span>
        </div>
      </div>

      <div className="dash-actions">
        <Link to="/arena" className="action-card">
          <h3>Coding Arena</h3>
          <p>Take on a timed challenge and earn points.</p>
          <span className="action-go">Start →</span>
        </Link>
        <Link to="/leaderboard" className="action-card">
          <h3>Leaderboard</h3>
          <p>See where you stand against everyone else.</p>
          <span className="action-go">View →</span>
        </Link>
        <Link to="/results" className="action-card">
          <h3>My Results</h3>
          <p>Review your past submissions and scores.</p>
          <span className="action-go">Review →</span>
        </Link>
      </div>
    </div>
  );
}