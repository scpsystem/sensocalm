import { useRef, useState } from "react";
import Art from "./Art.jsx";
import { clamp } from "../assets.js";
import { useDrag } from "../useDrag.js";
import { useAudio } from "./AudioManager.jsx";
// Lapisan: bingkai (tetap) > daun pintu > dasar selak > selak (digeser ke kiri untuk membuka kunci).
const SHIFT = 16.7; // jarak geseran selak (% lebar daun)
export default function DoorLock({ style }) {
  const { play } = useAudio();
  const grp = useRef(), sr = useRef(0), g = useRef({ x: 0, s: 0 });
  const [unlocked, setU] = useState(false), [open, setOpen] = useState(false), [s, setS] = useState(0), [drag, setDrag] = useState(false), [nudge, setN] = useState(false);
  const d = useDrag(
    (e) => {
      if (open) return; // tutup pintu dahulu
      const w = grp.current.getBoundingClientRect().width;
      sr.current = clamp(g.current.s - (e.clientX - g.current.x) / ((w * SHIFT) / 100), 0, 1);
      setS(sr.current);
    },
    { onStart: (e) => { g.current = { x: e.clientX, s: sr.current }; setDrag(true); },
      onEnd: () => { setDrag(false); const u = sr.current > 0.5; if (u !== unlocked) { setU(u); play("lock"); } sr.current = u ? 1 : 0; setS(sr.current); } }
  );
  const door = () => { if (!unlocked) { setN(true); setTimeout(() => setN(false), 450); return; } setOpen((v) => !v); };
  const cap = open ? "Pintu terbuka" : unlocked ? "Kunci dibuka" : "Terkunci";
  return (
    <div className="part door" style={style}>
      <Art k="doorFrame" className="fill" />
      <div className="dgroup" ref={grp}>
        <div className={"dleaf" + (open ? " open" : "") + (nudge ? " nudge" : "")}>
          <Art k="doorLeaf" className="fill" />
          <button className="dtap" aria-label="Pintu" onClick={door} />
          <Art k="doorBase" className="fill" />
          <div className={"dbar" + (drag ? " moving" : "")} style={{ transform: `translateX(${-s * SHIFT}%)` }}>
            <Art k="latch" className="fill" />
            <div className="bhit drag" role="slider" tabIndex={0} aria-label="Selak kunci" aria-valuetext={cap} {...d}
              onKeyDown={(e) => { if (open) return; if (e.key === "ArrowLeft") { sr.current = 1; setS(1); setU(true); play("lock"); } if (e.key === "ArrowRight") { sr.current = 0; setS(0); setU(false); play("lock"); } }} />
          </div>
        </div>
      </div>
      <p className="cap">{cap}</p>
    </div>
  );
}
