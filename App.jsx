import { useState } from "react";
import { AudioProvider, useAudio } from "./components/AudioManager.jsx";
import { SettingsProvider, useSettings } from "./components/Settings.jsx";
import HomeScreen from "./HomeScreen.jsx";
import ThemeSelection from "./components/ThemeSelection.jsx";
import SensoryRoom from "./components/SensoryRoom.jsx";
import FidgetBoard from "./components/FidgetBoard.jsx";
import KineticSand from "./components/KineticSand.jsx";
import GrassTouch from "./components/GrassTouch.jsx";
import InteractiveAquarium from "./components/InteractiveAquarium.jsx";

const ACTIVITIES = ["fidget", "sand", "grass", "aqua"]; // id objek bilik = nama skrin aktiviti
function Shell() {
  const { enabled, toggle } = useAudio(), { reduced, toggle: toggleMotion } = useSettings();
  const [screen, setScreen] = useState("home");
  const [theme, setTheme] = useState("1"); // kekal apabila keluar daripada aktiviti
  const inActivity = ACTIVITIES.includes(screen), inRoom = screen === "room" || inActivity;
  const back = () => setScreen(inActivity ? "room" : screen === "room" ? "themes" : "home");
  return (
    <div className="app" data-theme={inRoom ? "t" + theme : "t0"} data-reduced={reduced ? "1" : undefined}>
      <header className="bar">
        <div className="bar-l">
          {screen !== "home" && (<><button className="btn" onClick={() => setScreen("home")}>HOME</button><button className="btn" onClick={back}>KEMBALI</button></>)}
        </div>
        <div className="bar-l">
          <button className="btn soft" aria-pressed={reduced} onClick={toggleMotion}>{reduced ? "ANIMASI: KURANG" : "ANIMASI: PENUH"}</button>
          <button className="btn soft" aria-pressed={enabled} onClick={toggle}>{enabled ? "AUDIO: ON" : "AUDIO: OFF"}</button>
        </div>
      </header>
      <main className="main">
        {screen === "home" && <HomeScreen onStart={() => setScreen("themes")} />}
        {screen === "themes" && <ThemeSelection onPick={(t) => { setTheme(t); setScreen("room"); }} />}
        {screen === "room" && <SensoryRoom theme={theme} onOpen={(o) => setScreen(o.id)} />}
        {screen === "fidget" && <FidgetBoard />}
        {screen === "sand" && <KineticSand onBack={() => setScreen("room")} />}
        {screen === "grass" && <GrassTouch />}
        {screen === "aqua" && <InteractiveAquarium />}
      </main>
    </div>
  );
}
export default function App() { return <SettingsProvider><AudioProvider><Shell /></AudioProvider></SettingsProvider>; }
