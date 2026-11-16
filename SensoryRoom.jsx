import Art from "./Art.jsx";
// Lapisan 1: latar. Lapisan 2: objek (peratus daripada latar, jadi kedudukan kekal).
const OBJS = [
  { id: "fidget", label: "Fidget Board", x: 36, y: 16 },
  { id: "grass", label: "Grass Touch", x: 52, y: 16 },
  { id: "sand", label: "Pasir Kinetik", x: 36, y: 46 },
  { id: "aqua", label: "Mini Akuarium", x: 52, y: 46 },
];
export default function SensoryRoom({ theme, onOpen }) {
  return (
    <div className="scene">
      <Art k={"bg" + theme} className="cover" />
      {OBJS.map((o) => (
        <button key={o.id} className="hot" aria-label={o.label} style={{ left: o.x + "%", top: o.y + "%", width: "14%" }} onClick={() => onOpen(o)}>
          <Art k={o.id + theme} className="fill" />
          <span className="tag">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
