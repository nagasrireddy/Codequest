import { useEffect, useState } from "react";

export default function Timer({ seconds = 300, onExpire, running = true }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => { setLeft(seconds); }, [seconds]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) { onExpire?.(); return; }
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, running]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return <div className={`timer ${left <= 30 ? "timer-low" : ""}`}>{mm}:{ss}</div>;
}