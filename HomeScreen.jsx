import Art from "./Art.jsx";
// Latar utama sudah mengandungi logo; butang MULA diletakkan di bawah, jauh dari logo.
export default function HomeScreen({ onStart }) {
  return (
    <div className="scene">
      <Art k="homeBg" className="cover" />
      <button className="btn go" onClick={onStart}>MULA</button>
    </div>
  );
}
