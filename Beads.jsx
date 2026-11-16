import { useRef, useState } from "react";
import Art from "./Art.jsx";
import { clamp } from "../assets.js";
import { useDrag } from "../useDrag.js";
import { useAudio } from "./AudioManager.jsx";
// Gambar rod_manik.png sudah ada tiga rod. Nilai di bawah diukur daripada gambar itu.
const ROWS = [0.2197, 0.4938, 0.774]; // pusat setiap rod (% tinggi)
const MIN = 17, MAX = 82, BW = 22;     // julat pergerakan manik (% lebar) dan lebar manik
const RATIO = 1.5947;                  // lebar/tinggi gambar rod
function Bead({ k, name, row, start }) {
  const { play } = useAudio();
  const host = useRef(), [t, setT] = useState(start);
  const d = useDrag((e) => {
    const r = host.current.getBoundingClientRect();
    const c = ((e.clientX - r.left) / r.width) * 100 - BW / 2;           // kedudukan kiri manik (%)
    const v = clamp((c - MIN) / (MAX - BW - MIN), 0, 1);
    setT((p) => { if (Math.abs(v - p) > 0.02) play("bead", 120); return v; });
  });
  const key = (e) => { if (e.key === "ArrowRight") setT((v) => clamp(v + 0.1, 0, 1)); if (e.key === "ArrowLeft") setT((v) => clamp(v - 0.1, 0, 1)); };
  return (
    <div className="bead drag" role="slider" tabIndex={0} aria-label={"Manik " + name} aria-valuenow={Math.round(t * 100)} onKeyDown={key} {...d}
      ref={(el) => el && (host.current = el.parentElement)}
      style={{ left: MIN + t * (MAX - BW - MIN) + "%", top: ROWS[row] * 100 - (BW * RATIO) / 2 + "%", width: BW + "%" }}>
      <Art k={k} className="fill" />
    </div>
  );
}
export default function Beads({ style }) {
  return (
    <div className="part" style={style}>
      <Art k="rod" className="fill" />
      <Bead k="beadPink" name="merah jambu" row={0} start={0} />
      <Bead k="beadYellow" name="kuning" row={1} start={0.5} />
      <Bead k="beadBlue" name="biru" row={2} start={1} />
    </div>
  );
}
