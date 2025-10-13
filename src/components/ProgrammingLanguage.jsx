export default function ProgrammingLanguage(lan) {
  const styles = {
    backgroundColor: lan.fillColor,
    color: lan.textColor,
  };

  return (
    <div className="lan-card-wrapper">
      <div
        style={styles}
        className={`programming-language-card ${
          lan.isEliminated ? "isDisabled" : ""
        }`}
      >
        <span>{lan.language}</span>
      </div>
      {lan.isEliminated && <span className="death-icon">💀</span>}
    </div>
  );
}