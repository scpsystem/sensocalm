import { useRef, useState } from "react";
import Art from "./Art.jsx";
import AnimatedFish from "./AnimatedFish.jsx";
import WaterRipple from "./WaterRipple.jsx";
import WaterfallEffect from "./WaterfallEffect.jsx";
import { useAudio } from "./AudioManager.jsx";
import { useSettings } from "./Settings.jsx";
const SW = 1672, SH = 941, CX = 830, CY = 450, CR = 420; // tingkap bulat akuarium dalam latar (unit)
const FISH = [
  { k: "fish1", w: 165, x: 700, y: 380, sp: 34 }, { k: "fish2", w: 150, x: 900, y: 520, sp: 28 },
  { k: "fish3", w: 150, x: 800, y: 300, sp: 38 }, { k: "fish4", w: 155, x: 980, y: 430, sp: 30 },
];
export default function InteractiveAquarium() {
  const { play } = useAudio(), { reduced } = useSettings();
  const box = useRef(), id = useRef(0), [fx, setFx] = useState([]);
  const add = (x, y, kind) => { // hadkan 6 kesan aktif
    const k = ++id.current; setFx((p) => [...p.slice(-5), { k, x, y, kind }]);
    setTimeout(() => setFx((p) => p.filter((q) => q.k !== k)), reduced ? 1000 : 2600);
  };
  const tap = (e) => {
    const r = box.current.getBoundingClientRect(), ux = ((e.clientX - r.left) / r.width) * SW, uy = ((e.clientY - r.top) / r.height) * SH;
    if (Math.hypot(ux - CX, uy - CY) > CR) return; // hanya kawasan air
    add((ux / SW) * 100, (uy / SH) * 100, "ripple"); play("ripple", 200);
  };
  return (
    <section className="activity">
      <p className="ahint">Sentuh air atau ikan.</p>
      <div className="scene aqua" ref={box}>
        <Art k="aquaBg" className="cover" />
        <div className="water" onPointerDown={tap} />
        <WaterfallEffect />
        {FISH.map((f) => <AnimatedFish key={f.k} f={f} reduced={reduced} onSplash={(x, y) => { add((x / SW) * 100, (y / SH) * 100, "splash"); play("splash"); }} />)}
        {fx.map((f) => <WaterRipple key={f.k} x={f.x} y={f.y} kind={f.kind} />)}
      </div>
    </section>
  );
}
