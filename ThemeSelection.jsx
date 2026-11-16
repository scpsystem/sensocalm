import Art from "./Art.jsx";
const THEMES = [{ id: "1", name: "Bilik Biru Senja" }, { id: "2", name: "Bilik Kuning Mentari" }];
export default function ThemeSelection({ onPick }) {
  return (
    <section className="themes">
      <h1>Pilih Bilik Kegemaran Kamu</h1>
      <div className="cards">
        {THEMES.map((t) => (
          <article className={"card t" + t.id} data-theme={"t" + t.id} key={t.id}>
            <div className="prev"><Art k={"bg" + t.id} className="cover" /></div>
            <h2>{t.name}</h2>
            <button className="btn" onClick={() => onPick(t.id)}>PILIH</button>
          </article>
        ))}
      </div>
    </section>
  );
}
