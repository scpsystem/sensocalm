import Art from "./Art.jsx";
import { A, box } from "../assets.js";
import PopIt from "./PopIt.jsx";
import GearSet from "./Gear.jsx";
import Zipper from "./Zipper.jsx";
import DoorLock from "./DoorLock.jsx";
import MazeSlider from "./MazeSlider.jsx";
import SnapButton from "./SnapButton.jsx";
import Beads from "./Beads.jsx";
// Susun atur papan (unit 1200x800). Laras kedudukan di sini sahaja.
export default function FidgetBoard() {
  const missing = Object.values(A).filter((a) => !a.have).map((a) => a.file);
  return (
    <section className="fidget">
      <div className="stage-scroll">
        <div className="stage">
          <Art k="board" className="cover" />
          <PopIt style={box(100, 90, 330, 330)} />
          <GearSet />
          <Zipper style={box(840, 90, 280, 93)} />
          <SnapButton style={box(840, 215, 280, 93)} />
          <DoorLock style={box(90, 450, 330, 226)} />
          <MazeSlider style={box(450, 430, 300, 300)} />
          <Beads style={box(790, 440, 330, 207)} />
        </div>
      </div>
      <p className="hint">Tekan, geser dan putar. Pada skrin kecil, seret papan ke tepi.</p>
      {missing.length > 0 && <details className="missing"><summary>Aset yang masih diperlukan ({missing.length})</summary><ul>{missing.map((m) => <li key={m}>{m}</li>)}</ul></details>}
    </section>
  );
}
