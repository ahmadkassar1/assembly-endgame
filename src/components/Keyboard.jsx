export default function Keyboard(key) {
  // console.log("keybo", key);
  const styles = {
    backgroundColor: key.isCorrect ? "#10A95B" : key.isWrong ? "#EC5D49" : "",
  };
  return (
    <button
      onClick={() => {
        key.onKeyClick(key);
      }}
      style={styles}
      className="input-key"
    >
      {key.value}
    </button>
  );
}
