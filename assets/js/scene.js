(() => {
  const root = document.getElementById('scene');
  if (!root) return;
  const R = (a, b) => a + Math.random() * (b - a);
  const add = (html) => root.insertAdjacentHTML('beforeend', html);

  // Bintang berkelip
  for (let i = 0; i < 42; i++) {
    add(`<i class="sc-star" style="left:${R(2, 98)}%;top:${R(2, 60)}%;--d:${R(2, 5)}s;--l:${R(0, 4)}s;--z:${R(1, 2.4)}px"></i>`);
  }
  // Awan yang melintas pelan
  [[12, 38, 0], [30, 52, -20]].forEach(([top, dur, delay]) =>
    add(`<i class="sc-cloud" style="top:${top}%;--d:${dur}s;--l:${delay}s"></i>`));
  // Bulan sabit
  add('<svg class="sc-moon" viewBox="0 0 46 46"><path fill="currentColor" d="M30 4a20 20 0 1 0 12 32A17 17 0 0 1 30 4z"/></svg>');
  // Burung terbang melintasi layar sambil mengepak
  const bird = '<svg viewBox="-14 -9 28 14" width="28" height="14"><path d="M-13 0Q-6.5-9 0 0Q6.5-9 13 0Q6.5-4 0 2Q-6.5-4-13 0z"/></svg>';
  [[20, 16, 2.2, 1], [30, 22, 4.5, .75], [14, 13, 7, 1.15], [26, 19, 10, .6], [36, 24, 13, .85]]
    .forEach(([t, d, l, s]) => add(`<div class="sc-bird" style="--t:${t}%;--d:${d}s;--l:${l}s;--s:${s}">${bird}</div>`));

  // Burung ikut berhenti saat musik dijeda, dan terbang lagi saat musik diputar
  const bgm = document.getElementById('bgm');
  if (bgm) {
    let started = false;
    bgm.addEventListener('play', () => { started = true; root.classList.remove('sc-paused'); });
    bgm.addEventListener('pause', () => { if (started) root.classList.add('sc-paused'); });
  }
})();
