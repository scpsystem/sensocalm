// ===== PENGURUSAN ASET =====
// Fail sebenar ada dalam public/assets/. Aset yang belum ada ditanda have:false
// (placeholder kelihatan dalam app). Bila fail sudah diletak, tukar have kepada true.
const f = (file, have = true) => ({ file, have });
export const A = {
  // Bilik & objek bilik (tema 1 = biru, tema 2 = kuning)
  bg1: f("latar_tema_1.png"), bg2: f("latar_tema_2.png"),
  fidget1: f("ikon_fidget_biru.png"), fidget2: f("ikon_fidget_board.png"),
  grass1: f("ikon_grass_touch_biru.png"), grass2: f("ikon_grass_touch.png"),
  sand1: f("ikon_pasir_kinetik_biru.png"), sand2: f("ikon_pasir_kinetik.png"),
  aqua1: f("ikon_aquarium_biru.png"), aqua2: f("ikon_aquarium.png"),
  homeBg: f("latar_utama.png"),
  // Fidget Board
  board: f("papan_kayu.png"),
  pop: f("pop_it_gelembung.png"), popIn: f("pop_it_gelembung_tekan.png"),
  gearY: f("gear_kuning.png"), gearP: f("gear_ungu.png"), gearB: f("gear_biru.png"),
  zipOpen: f("zip_jalur_terbuka.png"), zipClosed: f("zip_jalur_tertutup.png"),
  doorFrame: f("pintu_bingkai.png"), doorLeaf: f("pintu_daun.png"), doorBase: f("pintu_selak_dasar.png"), latch: f("pintu_selak.png"),
  maze: f("laluan_tombol.png"), knob: f("tombol_ungu.png"),
  snapClosed: f("butang_tutup.png"), snapOpen: f("butang_buka.png"),
  rod: f("rod_manik.png"),
  // Aktiviti 2-4
  sandTray: f("pasir_kinetik.png"), grassBg: f("latar_rumput.png"), grassTuft: f("rumput.png"),
  aquaBg: f("latar_akuarium.png"), fish1: f("ikan_1.png"), fish2: f("ikan2.png"), fish3: f("ikan3.png"), fish4: f("ikan4.png"),
  beadPink: f("manik_merah_jambu.png"), beadYellow: f("manik_kuning.png"), beadBlue: f("manik_biru.png"),
};
// Sandaran: { kunciAset: "kunciLain" } jika aset belum ada.
export const FALLBACK = {};
export const url = (file) => globalThis.__ASSETS?.[file] || "assets/" + file;
// Koordinat papan: 1200 x 800 unit -> peratus (kekal sejajar semasa saiz berubah)
export const box = (x, y, w, h) => ({ left: x / 12 + "%", top: y / 8 + "%", width: w / 12 + "%", height: h / 8 + "%" });
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
