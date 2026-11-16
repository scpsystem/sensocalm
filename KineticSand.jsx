import { useEffect, useRef } from "react";
import Art from "./Art.jsx";
import { useAudio } from "./AudioManager.jsx";
// Kawasan pasir dalam pasir_kinetik.png (% daripada gambar, diukur daripada fail).
const RECT = { x: 6.5, y: 10.5, w: 87, h: 79.5 };
const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const layer = () => { const c = document.createElement("canvas"); return { c, x: c.getContext("2d") }; };

export default function KineticSand({ onBack }) {
  const { loop } = useAudio();
  const cv = useRef(), L = useRef([layer(), layer(), layer()]), strokes = useRef([]), cur = useRef(null);
  const raf = useRef(0), idle = useRef(0), size = useRef({ w: 1, h: 1, d: 1 });

  // Tiga lapisan (bayang, lantai alur, tepi cerah) digabung -> kesan ukiran tanpa tompokan pada sambungan.
  const compose = () => {
    raf.current = 0; const c = cv.current; if (!c) return; const x = c.getContext("2d");
    x.clearRect(0, 0, c.width, c.height);
    [[0, 0.55], [1, 0.78], [2, 0.65]].forEach(([i, a]) => { x.globalAlpha = a; x.drawImage(L.current[i].c, 0, 0); });
    x.globalAlpha = 1;
  };
  const sched = () => { if (!raf.current) raf.current = requestAnimationFrame(compose); };
  const seg = (a, b, rand) => {
    const { w: cw, d } = size.current, w = Math.min(22, Math.max(8, cw * 0.026)), [s, f, h] = L.current;
    const line = (l, ox, oy, lw, col) => { const x = l.x; x.strokeStyle = col; x.lineWidth = lw * d; x.lineCap = "round"; x.lineJoin = "round"; x.beginPath(); x.moveTo((a.x + ox) * d, (a.y + oy) * d); x.lineTo((b.x + ox) * d + 0.01, (b.y + oy) * d); x.stroke(); };
    line(s, -w * 0.2, -w * 0.2, w * 0.9, "#6e4416");
    line(f, 0, 0, w * 0.82, "#d2a665");
    line(h, w * 0.5, w * 0.5, w * 0.22, "#fff3d6");
    const n = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 4) || 1; // butiran halus sepanjang garisan
    for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) {
      const t = i / n, ang = rand() * 6.283, r = rand() * w * 0.4;
      f.x.fillStyle = rand() > 0.5 ? "#b07d38" : "#e0b772";
      f.x.fillRect((a.x + (b.x - a.x) * t + Math.cos(ang) * r) * d, (a.y + (b.y - a.y) * t + Math.sin(ang) * r) * d, 1.5 * d, 1.5 * d);
    }
  };
  const replay = () => {
    const { w, h } = size.current;
    strokes.current.forEach((s) => { const rand = rng(s.seed), P = s.pts.map(([x, y]) => ({ x: x * w, y: y * h })); if (P.length === 1) seg(P[0], P[0], rand); else for (let i = 1; i < P.length; i++) seg(P[i - 1], P[i], rand); });
  };
  const clearLayers = () => L.current.forEach((l) => l.x.clearRect(0, 0, l.c.width, l.c.height));

  useEffect(() => {
    const c = cv.current;
    const fit = () => {
      const r = c.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
      if (!r.width) return;
      size.current = { w: r.width, h: r.height, d };
      c.width = L.current[0].c.width = L.current[1].c.width = L.current[2].c.width = Math.round(r.width * d);
      c.height = L.current[0].c.height = L.current[1].c.height = L.current[2].c.height = Math.round(r.height * d);
      replay(); compose(); // lukisan dikekalkan semasa saiz berubah
    };
    fit(); const ro = new ResizeObserver(fit); ro.observe(c);
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current); clearTimeout(idle.current); loop("sand", false); };
  }, []);

  const pt = (e) => { const r = cv.current.getBoundingClientRect(); return { x: Math.max(0, Math.min(r.width, e.clientX - r.left)), y: Math.max(0, Math.min(r.height, e.clientY - r.top)) }; };
  const sound = (on) => { loop("sand", on); clearTimeout(idle.current); if (on) idle.current = setTimeout(() => loop("sand", false), 140); };
  const down = (e) => {
    cv.current.setPointerCapture(e.pointerId); e.preventDefault();
    const p = pt(e), { w, h } = size.current, s = { seed: strokes.current.length * 7919 + 13, pts: [[p.x / w, p.y / h]] };
    s.rand = rng(s.seed); strokes.current.push(s); cur.current = { s, last: p };
    seg(p, p, s.rand); sched(); sound(true);
  };
  const move = (e) => {
    const k = cur.current; if (!k) return; const { w, h } = size.current;
    for (const ev of e.nativeEvent.getCoalescedEvents?.() || [e.nativeEvent]) { // semua titik antara (interpolasi)
      const p = pt(ev); if (Math.hypot(p.x - k.last.x, p.y - k.last.y) < 1.5) continue;
      seg(k.last, p, k.s.rand); k.s.pts.push([p.x / w, p.y / h]); k.last = p;
    }
    sched(); sound(true);
  };
  const up = () => { cur.current = null; clearTimeout(idle.current); loop("sand", false); };
  const erase = () => { strokes.current = []; clearLayers(); compose(); };

  return (
    <section className="activity">
      <p className="ahint">Lukis atau tulis di atas pasir.</p>
      <div className="sandwrap">
        <Art k="sandTray" className="fill" />
        <div className="sandcv" style={{ left: RECT.x + "%", top: RECT.y + "%", width: RECT.w + "%", height: RECT.h + "%" }}>
          <canvas ref={cv} className="drag" aria-label="Permukaan pasir" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        </div>
      </div>
      <div className="arow"><button className="btn" onClick={erase}>PADAM</button><button className="btn soft" onClick={onBack}>KEMBALI</button></div>
    </section>
  );
}
