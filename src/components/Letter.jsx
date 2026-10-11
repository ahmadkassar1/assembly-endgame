export default function Letter({ letter, visible, missed }) {
  return (
    <span
      className={`guess-box${visible ? " letter-visible" : ""}${missed ? " letter-missed" : ""}`}
    >
      {visible ? letter : ""}
    </span>
  );
}
