import { useState } from "react";
import Art from "./Art.jsx";
import { useAudio } from "./AudioManager.jsx";
export default function SnapButton({ style }) {
  const { play } = useAudio();
  const [open, setOpen] = useState(false);
  return (
    <button className="part snap" style={style} aria-pressed={open} aria-label={open ? "Tutup tali" : "Buka tali"} onClick={() => { setOpen(!open); play("snap"); }}>
      <Art k="snapClosed" className={"fill layer" + (open ? " off" : "")} />
      <Art k="snapOpen" className={"fill layer" + (open ? "" : " off")} />
    </button>
  );
}
