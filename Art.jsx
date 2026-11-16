import { A, FALLBACK, url } from "../assets.js";
// Papar gambar sebenar; jika belum ada, papar placeholder berlabel nama fail.
export default function Art({ k, className = "", style, label = true }) {
  let a = A[k];
  if (!a.have && FALLBACK[k]) a = A[FALLBACK[k]];
  if (a.have) return <img src={url(a.file)} alt="" className={"art " + className} style={style} draggable="false" />;
  return <div className={"slot " + className} style={style} role="img" aria-label={"Aset diperlukan: " + a.file}>{label && <span>{a.file}</span>}</div>;
}
