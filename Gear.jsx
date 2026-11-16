import { useRef, useState } from "react";
import Art from "./Art.jsx";
import { box } from "../assets.js";
import { useDrag } from "../useDrag.js";
import { useAudio } from "./AudioManager.jsx";
// Gear bersambung: kuning -> ungu -> biru. f = nisbah putaran (negatif = arah bertentangan).
const SY = 210, SP = 190, SB = 176;
const GEARS = [
  { k: "gearY", n: "kuning", cx: 530, cy: 240, s: SY, f: 1 },
  { k: "gearP", n: "ungu", cx: 655, cy: 196, s: SP, f: -SY / SP },
  { k: "gearB", n: "biru", cx: 690, cy: 312, s: SB, f: SY / SB },
];
const angle = (e, r) => (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;

function Gear({ g, rot, onTurn }) {
  const last = useRef(0);
  const d = useDrag(
    (e) => {
      const x = angle(e, e.currentTarget.getBoundingClientRect());
      let dx = x - last.current;
      if (dx > 180) dx -= 360; if (dx < -180) dx += 360;
      last.current = x;
      onTurn(Math.max(-18, Math.min(18, dx))); // had kelajuan putaran
    },
    { onStart: (e) => (last.current = angle(e, e.currentTarget.getBoundingClientRect())) }
  );
  const key = (e) => { if (e.key === "ArrowRight") onTurn(8); if (e.key === "ArrowLeft") onTurn(-8); };
  return (
    <div className="gear drag" tabIndex={0} role="slider" aria-label={"Gear " + g.n} onKeyDown={key} {...d}
      style={box(g.cx - g.s / 2, g.cy - g.s / 2, g.s, g.s)}>
      <Art k={g.k} className="fill" style={{ transform: `rotate(${rot}deg)` }} />
    </div>
  );
}
export default function GearSet() {
  const [a, setA] = useState(0);
  const { play } = useAudio();
  return GEARS.map((g) => (
    <Gear key={g.k} g={g} rot={a * g.f} onTurn={(d) => { setA((v) => v + d / g.f); play("gear", 250); }} />
  ));
}
