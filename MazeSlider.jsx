import { useRef, useState } from "react";
import Art from "./Art.jsx";
import PATH from "../mazePath.json"; // garis tengah laluan_tombol.png (koordinat 0-1)
import { useDrag } from "../useDrag.js";
import { useAudio } from "./AudioManager.jsx";
const N = PATH.length, WIN = 14; // tombol hanya boleh bergerak ke titik berdekatan sepanjang laluan
export default function MazeSlider({ style }) {
  const { play } = useAudio();
  const ref = useRef(), cur = useRef(0), [i, setI] = useState(0);
  const go = (j) => { cur.current = (j + N) % N; setI(cur.current); play("knob", 140); };
  const d = useDrag((e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    let best = cur.current, bd = 1e9;
    for (let k = -WIN; k <= WIN; k++) {
      const j = (cur.current + k + N) % N, dx = PATH[j][0] - px, dy = PATH[j][1] - py, dd = dx * dx + dy * dy;
      if (dd < bd) { bd = dd; best = j; }
    }
    if (best !== cur.current) go(best);
  });
  return (
    <div className="part" style={style} ref={ref}>
      <Art k="maze" className="fill" />
      <div className="knob drag" role="slider" tabIndex={0} aria-label="Tombol laluan" aria-valuenow={i} aria-valuemax={N}
        style={{ left: PATH[i][0] * 100 + "%", top: PATH[i][1] * 100 + "%" }} {...d}
        onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowDown") go(cur.current + 2); if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(cur.current - 2); }}>
        <Art k="knob" className="fill" />
      </div>
    </div>
  );
}
