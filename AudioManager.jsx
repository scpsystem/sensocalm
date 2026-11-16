import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
// Letak fail bunyi dalam public/audio/ kemudian tukar null, cth "audio/pop.mp3".
export const SOUND_FILES = {
  pop: null, gear: null, zip: null, lock: null, knob: null, snap: null, bead: null, // Fidget Board
  sand: null,   // geseran pasir (berulang semasa melukis)
  grass: null,  // geseran rumput (berulang semasa mengusap)
  ripple: null, // riak air (sekali)
  splash: null, // ikan kembali ke air (sekali)
  water: null,  // bunyi air latar akuarium (berulang)
};
const Ctx = createContext({ enabled: false, toggle() {}, play() {}, loop() {} });
export const useAudio = () => useContext(Ctx);
export function AudioProvider({ children }) {
  const [enabled, setEnabled] = useState(false); // MATI secara lalai
  const last = useRef({}), cache = useRef({}), loops = useRef({});
  const play = useCallback((name, gap = 120) => {
    const file = SOUND_FILES[name];
    if (!enabled || !file) return;
    const now = performance.now();
    if (now - (last.current[name] || 0) < gap) return; // elak bunyi bertindih
    last.current[name] = now;
    const a = (cache.current[name] ||= new Audio(file));
    a.volume = 0.5; a.currentTime = 0; a.play().catch(() => {});
  }, [enabled]);
  // Bunyi berulang: loop(nama, true) mula, loop(nama, false) henti. Satu elemen audio bagi setiap nama.
  const loop = useCallback((name, on, vol = 0.35) => {
    const file = SOUND_FILES[name]; let a = loops.current[name];
    if (!on || !enabled || !file) { if (a && !a.paused) a.pause(); return; }
    if (!a) { a = loops.current[name] = new Audio(file); a.loop = true; }
    a.volume = vol; if (a.paused) a.play().catch(() => {});
  }, [enabled]);
  useEffect(() => { if (!enabled) Object.values(loops.current).forEach((a) => a.pause()); }, [enabled]);
  return <Ctx.Provider value={{ enabled, toggle: () => setEnabled((v) => !v), play, loop }}>{children}</Ctx.Provider>;
}
