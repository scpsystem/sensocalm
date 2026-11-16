import { useState } from "react";
import Art from "./Art.jsx";
import { A, url } from "../assets.js";
import { useAudio } from "./AudioManager.jsx";
// Kedudukan 20 gelembung dalam pop_it_gelembung.png (piksel, imej 1254x1254), baris demi baris.
const S = 1254, R = 95;
const ROWS = [[268, [316, 530, 738, 942]], [476, [316, 524, 730, 948]], [684, [310, 520, 730, 942]], [874, [316, 520, 724, 942]], [1070, [310, 520, 730, 940]]];
// Satu gelembung tertekan (daripada pop_it_gelembung_tekan.png) untuk setiap warna baris: [x, y].
const PRESSED = [[620, 218], [626, 428], [628, 642], [626, 846], [626, 1048]];
const F = 1 / 1.12; // overlay lebih besar 12% daripada butang (inset -6%)
const DP = (R * 2 * 82) / 95; // diameter keratan gelembung tertekan (piksel)
const BUBBLES = ROWS.flatMap(([y, xs], r) => xs.map((x, c) => ({ x, y, r, key: r * 4 + c })));
export default function PopIt({ style }) {
  const { play } = useAudio();
  const [s, setS] = useState({});
  const tap = (k) => { setS((p) => ({ ...p, [k]: !p[k] })); play("pop", 60); };
  const pressed = A.popIn.have && url(A.popIn.file);
  return (
    <div className="part" style={style}>
      <Art k="pop" className="fill" />
      {BUBBLES.map((b) => {
        const [px, py] = PRESSED[b.r];
        return (
          <button key={b.key} className={"pb" + (s[b.key] ? " in" : "")} aria-pressed={!!s[b.key]} aria-label={"Gelembung " + (b.key + 1)}
            style={{ left: ((b.x - R) / S) * 100 + "%", top: ((b.y - R) / S) * 100 + "%", width: ((R * 2) / S) * 100 + "%" }} onClick={() => tap(b.key)}>
            {pressed && (
              <span className="pov"><img alt="" draggable="false" src={pressed}
                style={{ width: (S / DP) * 100 * F + "%", left: 50 - (px / DP) * 100 * F + "%", top: 50 - (py / DP) * 100 * F + "%" }} /></span>)}
          </button>
        );
      })}
    </div>
  );
}
