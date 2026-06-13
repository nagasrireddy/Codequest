export default function Leaderboard({ rows, highlightEmail }) {
  if (!rows?.length) {
    return <p className="empty">No scores yet. Be the first to solve a challenge.</p>;
  }
  return (
    <div className="lb">
      <div className="lb-head">
        <span>Rank</span><span>Player</span><span style={{ textAlign: "right" }}>Score</span>
      </div>
      {rows.map((r) => (
        <div key={r.rank} className={`lb-row ${r.user?.email === highlightEmail ? "lb-row-me" : ""}`}>
          <span className={`lb-rank ${r.rank <= 3 ? "lb-rank-top" : ""}`}>#{r.rank}</span>
          <span className="lb-name">{r.user?.name || "Unknown"}</span>
          <span className="lb-score">{r.totalScore}</span>
        </div>
      ))}
    </div>
  );
}