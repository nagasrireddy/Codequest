import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { token } = useAuth();
  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">Competitive coding, made simple</p>
        <h1 className="hero-title">
          Solve challenges.<br />Climb the <span className="hero-accent">leaderboard.</span>
        </h1>
        <p className="hero-sub">
          CodeQuest is a practice arena where you take on timed coding problems, earn points for
          correct answers, and see how you rank against everyone else.
        </p>
        <div className="hero-cta">
          {token ? (
            <Link to="/arena" className="btn btn-primary btn-lg">Enter the arena</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">Get started</Link>
              <Link to="/login" className="btn btn-ghost btn-lg">I have an account</Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <span className="feature-dot" />
          <h3>Timed challenges</h3>
          <p>Each problem runs against the clock to keep you sharp.</p>
        </div>
        <div className="feature">
          <span className="feature-dot" />
          <h3>Instant scoring</h3>
          <p>Submit an answer and find out right away if it's correct.</p>
        </div>
        <div className="feature">
          <span className="feature-dot" />
          <h3>Live leaderboard</h3>
          <p>Every point you earn moves you up the global ranking.</p>
        </div>
      </section>
    </div>
  );
}