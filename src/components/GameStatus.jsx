export default function GameStatus(message) {
  console.log(message)
  const styles = {
    backgroundColor: message.bkg,
  };
  return (
    <>
      {message.context.length > 0 ? (
        <div style={styles} className="status-message">
          {message.context}
        </div>
      ) : null}
    </>
  );
}
