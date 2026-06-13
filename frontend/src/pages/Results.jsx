import { useEffect, useState } from "react";
import * as submissionService from "../services/submissionService";

export default function Results() {
  const [data, setData] = useState({ submissions: [], totalScore: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    submissionService.getMySubmissions()
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="results">
      <header className="dash-head">
        <div>
          <p className="eyebrow">My Results</p>
          <h1 className="dash-title">Your submissions</h1>
        </div>
        <div className="results-score">
          <span className="stat-label">Total score</span>
          <div className="stat-value">{data.totalScore}</div>
        </div>
      </header>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : data.submissions.length === 0 ? (
        <p className="empty">You haven't attempted any challenges yet.</p>
      ) : (
        <div className="sub-list">
          {data.submissions.map((s) => {
            const diff = (s.questionId?.difficulty || "easy").toLowerCase();
            return (
              <div key={s._id} className="sub-row">
                <div className="sub-main">
                  <span className="sub-title">{s.questionId?.title || "Question"}</span>
                  <span className={`tag tag-${diff}`}>{diff}</span>
                </div>
                <span className={`sub-score ${s.score > 0 ? "ok" : "bad"}`}>
                  {s.score > 0 ? `+${s.score}` : "0"} pts
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}