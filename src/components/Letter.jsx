export default function Letter(letObj) {

  return <div className="guess-box">{letObj.isVisible ? letObj.character : ""}</div>;
}
