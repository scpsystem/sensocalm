import { useEffect, useMemo, useRef } from "react";
import Art from "./Art.jsx";
import { useAudio } from "./AudioManager.jsx";
import { useSettings } from "./Settings.jsx";
const REACH = 0.15, RATIO = 1.4825; // jejari sentuhan (lebar skrin) dan nisbah rumput.png
// Susunan tetap (berbenih): barisan jauh = kecil dan tinggi di skrin, barisan dekat = besar.
function layout(low) {
  let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const rows = low ? 5 : 6, n = low ? 6 : 8, out = [];
  for (let i = 0; i < rows; i++) {
    const y = 52 + (i * 46) / (rows - 1), w = 12 + (i * 11) / (rows - 1);
    for (let c = 0; c < n; c++) out.push({ x: ((c + (i % 2 ? 0.2 : 0.7)) / n) * 100 + (r() - 0.5) * (60 / n), y: y + (r() - 0.5) * 2, w: w * (0.9 + r() * 0.2), m: r() > 0.5 });
  }
  return out.map((t) => ({ ...t, h: t.w * (16 / 9) / RATIO }));
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function GrassTouch() {
  const { loop } = useAudio(), { reduced } = useSettings();
  const low = useMemo(() => reduced || (navigator.hardwareConcurrency || 8) <= 4, [reduced]);
  const tufts = useMemo(() => layout(low), [low]);
  const els = useRef([]), st = useRef([]), p = useRef({ down: false, x: 0, y: 0, vx: 0, t: 0 }), raf = useRef(0), snd = useRef(false), host = useRef();

  useEffect(() => {
    st.current = tufts.map(() => ({ a: 0, v: 0, last: 0 }));
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      const q = p.current; q.vx *= Math.exp(-dt * 6); // kelajuan jari susut apabila jari berhenti
      const av = Math.abs(q.vx), bend = av > 0.03 ? Math.sign(q.vx) * Math.min(45, 14 + av * 45) : 0; // arah = arah jari
      let active = q.down;
      tufts.forEach((t, i) => {
        const s = st.current[i], tx = t.x / 100, ty = (t.y - t.h / 2) / 100;
        const dist = Math.hypot(q.x - tx, (q.y - ty) * (9 / 16));
        const infl = q.down ? Math.pow(Math.max(0, 1 - dist / REACH), 1.4) : 0;
        const target = infl * (bend + Math.sign(tx - q.x) * 10);          // ikut arah jari + sedikit tolakan
        const k = q.down ? 70 : 26, c = 2 * Math.sqrt(k) * (reduced ? 1 : 0.55); // spring lembut
        s.v += (k * (target - s.a) - c * s.v) * dt; s.a += s.v * dt;
        if (Math.abs(s.a) > 0.03 || Math.abs(s.v) > 0.03) {
          active = true; els.current[i].style.transform = `rotate(${s.a.toFixed(2)}deg) skewX(${(-s.a * 0.2).toFixed(2)}deg)`;
        } else if (s.last) els.current[i].style.transform = "";
        s.last = Math.abs(s.a) > 0.03;
      });
      const on = q.down && Math.abs(q.vx) > 0.12;
      if (on !== snd.current) { snd.current = on; loop("grass", on); }
      raf.current = active ? requestAnimationFrame(tick) : 0;
      if (!active && snd.current) { snd.current = false; loop("grass", false); }
    };
    host.current.__wake = () => { if (!raf.current) { last = performance.now(); raf.current = requestAnimationFrame(tick); } };
    return () => { cancelAnimationFrame(raf.current); raf.current = 0; loop("grass", false); };
  }, [tufts, reduced]);

  const pos = (e) => { const r = host.current.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
  const down = (e) => { host.current.setPointerCapture(e.pointerId); const q = p.current, c = pos(e); Object.assign(q, { down: true, x: c.x, y: c.y, vx: 0, t: performance.now() }); host.current.__wake(); };
  const move = (e) => {
    const q = p.current; if (!q.down) return; const c = pos(e), now = performance.now(), dt = Math.max(0.008, (now - q.t) / 1000);
    q.vx += ((c.x - q.x) / dt - q.vx) * 0.4; q.x = c.x; q.y = c.y; q.t = now; host.current.__wake();
  };
  const up = () => { p.current.down = false; host.current.__wake(); };

  return (
    <section className="activity">
      <p className="ahint">Sentuh dan usap rumput.</p>
      <div className="scene grass drag" ref={host} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <Art k="grassBg" className="cover" />
        {tufts.map((t, i) => (
          <div key={i} className="tuft" style={{ left: t.x + "%", top: t.y + "%", width: t.w + "%" }}>
            <div className="tin" ref={(el) => (els.current[i] = el)}><div style={t.m ? { transform: "scaleX(-1)" } : undefined}><Art k="grassTuft" className="tart" /></div></div>
          </div>
        ))}
      </div>
    </section>
  );
}
