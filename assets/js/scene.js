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

  // Siluet istana (kiri) dan masjid (kanan)
  const win = (x, y) => `<rect class="sc-win" x="${x}" y="${y}" width="8" height="15" rx="4"/>`;
  add(`<svg class="sc-sky" viewBox="0 0 700 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <rect class="sc-sil" x="-300" y="178" width="1300" height="40"/>
    <g>
      <rect class="sc-sil" x="70" y="135" width="240" height="45"/>
      <rect class="sc-sil" x="160" y="100" width="60" height="35"/>
      <path class="sc-sil sc-dome" d="M158 100Q190 52 222 100z"/><path class="sc-gold" d="M190 62V46M158 100Q190 52 222 100"/>
      <rect class="sc-sil" x="70" y="105" width="34" height="30"/><path class="sc-sil" d="M66 105L87 76L108 105z"/>
      <rect class="sc-sil" x="276" y="105" width="34" height="30"/><path class="sc-sil" d="M272 105L293 76L314 105z"/>
      <path class="sc-gold" d="M87 76V64M293 76V64"/>
      ${win(80, 112)}${win(100, 150)}${win(125, 150)}${win(150, 150)}${win(230, 150)}${win(255, 150)}${win(283, 112)}${win(176, 108)}${win(184, 158)}
    </g>
    <g>
      <rect class="sc-sil" x="450" y="148" width="140" height="32"/>
      <path class="sc-sil sc-dome" d="M455 148A65 65 0 0 1 585 148z"/><path class="sc-gold" d="M455 148A65 65 0 0 1 585 148M520 83V68"/>
      <circle class="sc-gold" cx="520" cy="63" r="4"/>
      <path class="sc-sil" d="M440 148A18 18 0 0 1 476 148zM564 148A18 18 0 0 1 600 148z"/>
      <rect class="sc-sil" x="420" y="70" width="12" height="110"/><path class="sc-sil" d="M418 70L426 50L434 70z"/><rect class="sc-sil" x="415" y="96" width="22" height="4"/>
      <rect class="sc-sil" x="608" y="70" width="12" height="110"/><path class="sc-sil" d="M606 70L614 50L622 70z"/><rect class="sc-sil" x="603" y="96" width="22" height="4"/>
      ${win(478, 158)}${win(500, 158)}${win(522, 158)}${win(544, 158)}${win(424, 120)}${win(612, 120)}
    </g>
  </svg>`);
})();
