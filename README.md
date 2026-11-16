# Senso Calm – Fasa 1 (4 aktiviti)
Jalankan: `npm install` lalu `npm run dev` (bina: `npm run build`).

## Aktiviti
Fidget Board, Pasir Kinetik (KineticSand), Grass Touch (GrassTouch), Akuarium (InteractiveAquarium + AnimatedFish, WaterRipple, WaterfallEffect).
Navigasi dalam `src/App.jsx`; id objek bilik = nama skrin aktiviti. Tema kekal apabila keluar daripada aktiviti.

## Imej (semua ada; fail dalam public/assets/, senarai dalam src/assets.js)
Gambar `pintu_daun.png`, `pintu_selak_dasar.png` dan `pintu_selak.png` (selak) dipecahkan daripada pintu_selak asal anda (disimpan dalam public/assets/asal/).
`pintu_bingkai.png` sudah dibuang latarnya. Imej ikan, rumput, tombol, rod dipotong ke tepi gambar sahaja.

## Audio (belum ada fail) – letak dalam public/audio/ dan isi SOUND_FILES di src/components/AudioManager.jsx
Sekali: pop, gear, zip, lock, knob, snap, bead, ripple, splash
Berulang (loop): sand (geseran pasir), grass (geseran rumput), water (air latar akuarium)
