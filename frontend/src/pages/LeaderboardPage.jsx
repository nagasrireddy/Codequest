import { useEffect, useState } from "react";
import Leaderboard from "../components/Leaderboard";
import { useAuth } from "../context/AuthContext";
import * as leaderboardService from "../services/leaderboardService";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardService.getLeaderboard(1, 50)
      .then(({ data }) => setRows(data.leaderboard))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="leaderboard-page">
      <header className="dash-head">
        <div>
          <p className="eyebrow">Leaderboard</p>
          <h1 className="dash-title">Global ranking</h1>
        </div>
      </header>
      {loading ? <p className="empty">Loading…</p> : <Leaderboard rows={rows} highlightEmail={user?.email} />}
    </div>
  );
}