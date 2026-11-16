import { createContext, useContext, useState } from "react";
// Pilihan "kurangkan animasi": lalai mengikut tetapan peranti (prefers-reduced-motion).
const Ctx = createContext({ reduced: false, toggle() {} });
export const useSettings = () => useContext(Ctx);
export function SettingsProvider({ children }) {
  const [reduced, setR] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  return <Ctx.Provider value={{ reduced, toggle: () => setR((v) => !v) }}>{children}</Ctx.Provider>;
}
