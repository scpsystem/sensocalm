import { useRef } from "react";
// Pointer Events: tetikus + sentuhan. Letak className "drag" (touch-action:none) pada elemen.
export function useDrag(onMove, { onStart, onEnd } = {}) {
  const on = useRef(false);
  const end = (e) => { if (on.current) { on.current = false; onEnd?.(e); } };
  return {
    onPointerDown: (e) => { on.current = true; e.currentTarget.setPointerCapture(e.pointerId); e.preventDefault(); onStart?.(e); },
    onPointerMove: (e) => { if (on.current) onMove(e); },
    onPointerUp: end, onPointerCancel: end,
  };
}
