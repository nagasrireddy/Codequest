export default function QuestionCard({ question, onSelect, active }) {
  const diff = (question.difficulty || "easy").toLowerCase();
  return (
    <button className={`q-card ${active ? "q-card-active" : ""}`} onClick={() => onSelect(question)}>
      <div className="q-card-top">
        <span className="q-title">{question.title}</span>
        <span className={`tag tag-${diff}`}>{diff}</span>
      </div>
      <p className="q-desc">{question.description}</p>
      <span className="q-points">{question.points} pts</span>
    </button>
  );
}