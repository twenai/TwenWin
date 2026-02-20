# TwenWin Interactive Prototype

Prototype interaktif mobile untuk konsep game **TwenWin** dengan fitur:

- Lucky Spin Wheel (tier hadiah biasa/langka/epic)
- Jackpot harian (ticket + countdown + draw)
- Mini-games (slot, scratch card, lucky dice)
- Leaderboard, shop, dan daily reward profile
- UI mobile + animasi confetti + sound effects WebAudio

## Jalankan versi HTML5 (langsung dicoba)

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000` di browser.

## Struktur

- `index.html` — layout layar mobile (Spin, Jackpot, Mini-games, Rank, Shop, Profile)
- `styles.css` — tema visual, tombol, komponen UI, animasi dasar
- `app.js` — flow game interaktif, state, RNG, mini-games, confetti, audio
- `engine-scripts/Unity_TwenWinManager.cs` — script starter Unity
- `engine-scripts/Godot_TwenWinManager.gd` — script starter Godot

## Catatan

Prototype ini fokus ke gameplay loop dan UX template agar bisa jadi fondasi game online.
Untuk produksi, sambungkan ke backend auth + database + server RNG + leaderboard real-time.
