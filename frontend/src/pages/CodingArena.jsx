import { useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import * as questionService from "../services/questionService";
import * as submissionService from "../services/submissionService";

export default function CodingArena() {
  const [questions, setQuestions] = useState([]);
  const [active, setActive] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    questionService.getQuestions()
      .then(({ data }) => setQuestions(data.questions))
      .catch((err) => setError(err.response?.data?.message || "Could not load questions."));
  }, []);

  const select = (q) => {
    setActive(q); setAnswer(""); setResult(null); setError("");
  };

  const submit = async () => {
    if (!active || !answer.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const { data } = await submissionService.submitAnswer(active._id, answer);
      setResult(data.result);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const diff = (active?.difficulty || "easy").toLowerCase();

  return (
    <div className="arena">
      <div className="arena-list">
        <h2 className="section-title">Challenges</h2>
        {error && !active && <div className="alert alert-error">{error}</div>}
        {questions.length === 0 && !error && <p className="empty">No challenges available yet.</p>}
        <div className="q-list">
          {questions.map((q) => (
            <QuestionCard key={q._id} question={q} onSelect={select} active={active?._id === q._id} />
          ))}
        </div>
      </div>

      <div className="arena-work">
        {!active ? (
          <div className="arena-empty">
            <h3>Pick a challenge</h3>
            <p>Select a problem on the left to start solving.</p>
          </div>
        ) : (
          <div className="work-card">
            <div className="work-head">
              <div>
                <span className={`tag tag-${diff}`}>{diff}</span>
                <h2 className="work-title">{active.title}</h2>
              </div>
              <Timer seconds={300} running={!result} />
            </div>
            <p className="work-desc">{active.description}</p>

            <label className="field">
              <span className="field-label">Your answer</span>
              <textarea
                className="input textarea code"
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here…"
                disabled={!!result}
              />
            </label>

            {error && <div className="alert alert-error">{error}</div>}

            {result ? (
              <div className={`result ${result.correct ? "result-ok" : "result-bad"}`}>
                <strong>{result.correct ? "Correct!" : "Incorrect."}</strong>
                <span>+{result.scoreEarned} pts</span>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={submit} disabled={loading || !answer.trim()}>
                {loading ? "Submitting…" : "Submit answer"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}