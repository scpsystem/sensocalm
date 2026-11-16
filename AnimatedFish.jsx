import { useEffect, useRef } from "react";
import Art from "./Art.jsx";
const SW = 1672, SH = 941;                          // unit latar akuarium
export const AREA = { x0: 575, x1: 1085, y0: 235, y1: 690 }; // kawasan pusat ikan dalam tingkap akuarium
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function AnimatedFish({ f, reduced, onSplash }) {
  const el = useRef(), S = useRef(null), cb = useRef(onSplash);
  cb.current = onSplash;
  useEffect(() => {
    const s = (S.current = { x: f.x, y: f.y, vx: f.sp * (Math.random() < 0.5 ? -1 : 1), vy: 0, tvx: 0, tvy: 0, face: 1, t: Math.random() * 6, next: 0, jump: null, cool: 0 });
    s.tvx = s.vx; s.face = Math.sign(s.vx);
    let last = performance.now(), id;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; s.t += dt; s.next -= dt;
      const k = reduced ? 0.35 : 1;
      if (s.next <= 0) { s.next = 2 + Math.random() * 3.5; const dir = Math.random() < 0.3 ? -Math.sign(s.tvx) : Math.sign(s.tvx); s.tvx = dir * f.sp * (0.6 + Math.random() * 0.7); s.tvy = (Math.random() - 0.5) * f.sp * 0.6; }
      if (s.x < AREA.x0 + f.w / 2 + 20) s.tvx = Math.abs(s.tvx || f.sp);   // berpusing lembut di sempadan
      if (s.x > AREA.x1 - f.w / 2 - 20) s.tvx = -Math.abs(s.tvx || f.sp);
      if (s.y < AREA.y0 + 15) s.tvy = Math.abs(s.tvy) + 4;
      if (s.y > AREA.y1 - 15) s.tvy = -Math.abs(s.tvy) - 4;
      s.vx += (s.tvx - s.vx) * dt * 0.9; s.vy += (s.tvy - s.vy) * dt * 0.9;
      s.x = clamp(s.x + s.vx * dt * k, AREA.x0 + f.w / 2, AREA.x1 - f.w / 2);
      s.y = clamp(s.y + s.vy * dt * k, AREA.y0, AREA.y1);
      s.face += (Math.sign(s.tvx) - s.face) * Math.min(1, dt * 3); // pusingan badan perlahan
      let yo = 0, tilt = clamp(s.vy * 0.25, -8, 8);
      if (s.jump) {
        const p = (now - s.jump.t0) / s.jump.dur;
        if (p >= 1) { s.jump = null; s.cool = now + 600; cb.current(s.x, s.y); }
        else { yo = -s.jump.h * Math.sin(Math.PI * p); tilt = -22 * Math.cos(Math.PI * p); }
      }
      const y = s.y + Math.sin(s.t * 1.3) * 4 + yo, sg = s.face < 0 ? -1 : 1;
      el.current.style.left = (s.x / SW) * 100 + "%"; el.current.style.top = (y / SH) * 100 + "%";
      el.current.style.transform = `translate(-50%,-50%) rotate(${tilt * sg}deg) scaleX(${s.face.toFixed(3)})`;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [reduced]);
  const jump = () => {
    const s = S.current, now = performance.now(); if (!s || s.jump || now < s.cool) return; // satu lompatan pada satu masa
    s.jump = { t0: now, dur: reduced ? 1800 : 1500, h: Math.min(reduced ? 50 : 105, s.y - AREA.y0 + 55) };
  };
  return (
    <div className="fish" ref={el} role="button" tabIndex={0} aria-label="Ikan" onPointerDown={jump} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && jump()}
      style={{ width: (f.w / SW) * 100 + "%", left: (f.x / SW) * 100 + "%", top: (f.y / SH) * 100 + "%" }}>
      <Art k={f.k} className="fishimg" />
    </div>
  );
}
