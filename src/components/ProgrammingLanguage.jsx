export default function ProgrammingLanguage({
  name,
  background,
  color,
  eliminated,
  assemblyWins,
}) {
  return (
    <li
      className={`programming-language-card${eliminated ? " language-lost" : ""}`}
      style={{ "--language-background": background, "--language-color": color }}
      aria-label={`${name}: ${eliminated ? "lost" : assemblyWins ? "takes over" : "safe"}`}
    >
      <span aria-hidden="true">
        {name}
        {eliminated ? " ×" : ""}
      </span>
    </li>
  );
}
