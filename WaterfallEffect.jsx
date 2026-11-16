import { useEffect } from "react";
import { useAudio } from "./AudioManager.jsx";
// Bunyi air latar akuarium (berulang). Tiada visual. Berhenti apabila audio dimatikan atau aktiviti ditutup.
export default function WaterfallEffect() {
  const { enabled, loop } = useAudio();
  useEffect(() => { loop("water", enabled, 0.3); return () => loop("water", false); }, [enabled, loop]);
  return null;
}
