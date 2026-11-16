import { useRef, useState } from "react";
import Art from "./Art.jsx";
import { clamp } from "../assets.js";
import { useDrag } from "../useDrag.js";
import { useAudio } from "./AudioManager.jsx";
// Dua gambar: tertutup (kepala di kiri) dan terbuka (kepala di kanan).
// Seret ke kiri untuk menutup, ke kanan untuk membuka; gambar bertukar secara lembut.
export default function Zipper({ style }) {
  const { play } = useAudio();
  const ref = useRef(), tr = useRef(1), g = useRef({ x: 0, t: 1 });
  const [t, setT] = useState(1), [drag, setDrag] = useState(false); // 1 = terbuka, 0 = tertutup
  const set = (v) => { if (Math.abs(v - tr.current) > 0.04) play("zip", 160); tr.current = v; setT(v); };
  const d = useDrag(
    (e) => { const r = ref.current.getBoundingClientRect(); set(clamp(g.current.t + (e.clientX - g.current.x) / (r.width * 0.59), 0, 1)); },
    { onStart: (e) => { g.current = { x: e.clientX, t: tr.current }; setDrag(true); },
      onEnd: () => { setDrag(false); const v = tr.current > 0.5 ? 1 : 0; tr.current = v; setT(v); } }
  );
  return (
    <div className="part drag" style={style} ref={ref} role="slider" tabIndex={0} aria-label="Zip" aria-valuenow={Math.round(t * 100)}
      aria-valuetext={t > 0.5 ? "Terbuka" : "Tertutup"} {...d}
      onKeyDown={(e) => { if (e.key === "ArrowRight") set(1); if (e.key === "ArrowLeft") set(0); }}>
      <Art k="zipClosed" className="fill" style={{ opacity: 1 - t, transition: drag ? "none" : "opacity .35s ease" }} />
      <Art k="zipOpen" className="fill" style={{ opacity: t, transition: drag ? "none" : "opacity .35s ease" }} />
    </div>
  );
}
