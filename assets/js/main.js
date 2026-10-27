(() => {
  'use strict';
  const C = window.INVITATION, $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)], root = document.documentElement;
  const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const el = (t, c = '', x = '') => { const n = document.createElement(t); if (c) n.className = c; if (x) n.textContent = x; return n; };
  const RM = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Kunci halaman sampai tombol "Buka Undangan" ditekan */
  root.classList.add('locked');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  let tt;
  const toast = (m) => { const t = $('#toast'); t.textContent = m; t.style.opacity = 1; clearTimeout(tt); tt = setTimeout(() => (t.style.opacity = 0), 2200); };
  const copy = async (text, msg) => { try { await navigator.clipboard.writeText(text); toast(msg); } catch (e) { toast('Salin manual: ' + text); } };

  /* Teks dari config */
  document.title = C.site.title;
  $$('[data-bind]').forEach((n) => { const v = get(C, n.dataset.bind); if (v != null) n.textContent = v; });
  const ht = $('#heroTime'); C.events.forEach((e, i) => { if (i) ht.append(el('span', 'dt', '\u2022')); ht.append(el('span', '', e.title + ' ' + e.time)); });

  /* Mempelai */
  C.couple && [C.couple.bride, C.couple.groom].forEach((p) => {
    const c = el('div', 'pc glass fx'), a = el('div', 'arch pop'), img = el('img'), t = el('div', 'pt');
    img.src = p.photo; img.alt = 'Foto ' + p.full; img.loading = 'lazy'; a.append(img);
    t.append(el('h3', '', p.full), el('span', '', p.role), el('span', '', p.parents));
    c.append(a, t); $('#coupleGrid').append(c);
  });

  /* Acara */
  C.events.forEach((ev, i) => {
    const c = el('article', 'ev glass fx');
    c.append(el('div', 'ico pop' + (i ? ' g' : ''), i ? '✿' : '◐'), el('h3', '', ev.title), el('p', 'tm', ev.time));
    $('#eventsGrid').append(c);
  });
  $('#mapBtn').href = C.events[0].mapUrl;
  $('#copyAddr').addEventListener('click', () => copy(C.events[0].address, 'Alamat disalin'));

  /* Hadiah digital (disembunyikan lewat /hadiah=0 atau ?hadiah=0; menu ikut hilang) */
  if (location.pathname.includes('hadiah=0') || new URLSearchParams(location.search).get('hadiah') === '0') $('#hadiah').remove();
  else C.gifts.forEach((g) => {
    const c = el('div', 'gift glass fx');
    c.append(el('p', 'bank', g.bank));
    if (g.qris) { const q = el('img'); q.src = g.qris; q.alt = 'QRIS ' + g.bank; q.loading = 'lazy'; c.append(q); }
    if (g.number) c.append(el('p', 'no', g.number.replace(/(\d{4})(?=\d)/g, '$1 ')));
    c.append(el('p', 'an', 'a.n. ' + g.name));
    if (g.number) { const b = el('button', 'btn', 'Salin Nomor'); b.type = 'button'; b.addEventListener('click', () => copy(g.number, 'Nomor rekening disalin')); c.append(b); }
    $('#giftGrid').append(c);
  });

  /* Nama tamu: ?to=Nama+Tamu atau #Nama_Tamu */
  const readGuest = () => {
    let raw = new URLSearchParams(location.search).get('to');
    if (!raw && location.hash.length > 1) { try { raw = decodeURIComponent(location.hash.slice(1)).replace(/[_-]+/g, ' '); } catch (e) { raw = ''; } }
    raw = (raw || '').replace(/\s+/g, ' ').trim().slice(0, 50);
    if (!raw) return C.defaultGuest;
    return raw === raw.toLowerCase() ? raw.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : raw;
  };
  const applyGuest = () => {
    const n = readGuest(), input = $('#nama'); $('#guestName').textContent = n;
    if (!input.value || input.dataset.auto === '1') { input.value = n === C.defaultGuest ? '' : n; input.dataset.auto = '1'; }
  };
  applyGuest(); addEventListener('hashchange', applyGuest);

  /* Musik: baru bunyi setelah tombol ditekan; berhenti saat keluar dari situs, lanjut saat kembali */
  const bgm = $('#bgm'), cover = $('#cover'), mb = $('#musicBtn'); let started = false, resume = false;
  mb.title = C.musicTitle || 'Musik';
  bgm.preload = 'auto'; bgm.volume = 0.7; bgm.src = C.music;
  const icon = (on) => { $('#icPlay').classList.toggle('hidden', on); $('#icPause').classList.toggle('hidden', !on); mb.classList.toggle('playing', on); };
  bgm.addEventListener('play', () => { started = true; icon(true); cover.classList.remove('music-off'); });
  bgm.addEventListener('pause', () => { icon(false); if (started) cover.classList.add('music-off'); });
  const playMusic = async () => { try { await bgm.play(); } catch (e) { toast('Musik belum bisa diputar. Ketuk tombol musik.'); } };
  mb.addEventListener('click', () => (bgm.paused ? playMusic() : bgm.pause()));
  const away = () => { if (!bgm.paused) { resume = true; bgm.pause(); } };
  const back = () => { if (resume) { resume = false; bgm.play().catch(() => {}); } };
  document.addEventListener('visibilitychange', () => (document.hidden ? away() : back()));
  addEventListener('pagehide', away); addEventListener('pageshow', back);

  /* Burung terbang di cover */
  const bird = '<svg viewBox="-14 -9 28 14"><path d="M-13 0Q-6.5-9 0 0Q6.5-9 13 0Q6.5-4 0 2Q-6.5-4-13 0z"/></svg>';
  [[18, 16, 1, 1], [30, 22, 4, .75], [12, 13, 7, 1.15], [26, 19, 10, .6]].forEach(([t, d, l, s]) => {
    const i = document.createElement('i'); i.style.cssText = `--t:${t}%;--d:${d}s;--l:${l}s;--s:${s}`; i.innerHTML = bird; cover.querySelector('.birds').append(i);
  });

  /* Hitung mundur */
  const target = new Date(C.date.iso).getTime(), pad = (n) => String(n).padStart(2, '0'); let timer;
  const tick = () => {
    const d = target - Date.now();
    if (d <= 0) { ['d', 'h', 'm', 's'].forEach((k) => ($('#cd-' + k).textContent = '00')); const m = $('#cd-msg'); m.textContent = 'Hari bahagia telah tiba'; m.classList.remove('hidden'); clearInterval(timer); return; }
    $('#cd-d').textContent = pad(Math.floor(d / 864e5)); $('#cd-h').textContent = pad(Math.floor(d / 36e5) % 24);
    $('#cd-m').textContent = pad(Math.floor(d / 6e4) % 60); $('#cd-s').textContent = pad(Math.floor(d / 1e3) % 60);
  };
  tick(); timer = setInterval(tick, 1000);

  /* Hiasan sudut bergoyang + kilau emas (lapisan tetap: tidak bergeser saat scroll) */
  const rnd = Math.random;
  const deco = (host, n) => {
    const w = el('div', 'corners');
    ['tl', 'tr', 'bl', 'br'].forEach((p, i) => { const c = el('i', 'cn ' + p); c.style.setProperty('--d', i * 0.9 + 's'); w.append(c); });
    for (let i = 0; i < n; i++) { const s = el('span', 'sp'); s.style.cssText = `left:${rnd() < 0.5 ? rnd() * 16 : 84 + rnd() * 16}%;top:${rnd() * 100}%;--t:${3.5 + rnd() * 4}s;--d:${rnd() * 5}s`; w.append(s); }
    host.prepend(w);
  };
  deco($('#fx'), 8); deco(cover, 6);

  /* Pemisah halaman beranimasi */
  const pgs = $$('.pg');
  pgs.slice(0, -1).forEach((pg) => { const s = el('div', 'sep'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = '<i></i><span></span><b></b><span></span><i></i>'; pg.append(s); });
  const sio = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('show', e.isIntersecting)), { threshold: 0.6 });
  $$('.sep').forEach((s) => sio.observe(s));

  /* Animasi tiap halaman: bingkai muncul, ikon muncul, teks diketik cepat. Berulang setiap masuk dari atas maupun bawah */
  const SKIP = '.orn,.ar,.ico,.cd *,.wish-list *,#wishCount,.rp *,.stp *,.sep *,.pill i,.dot *,button,a.btn,output';
  const setK = (n, k) => { n._a.nodeValue = n._t.slice(0, k); n._b.textContent = n._t.slice(k); };
  const stage = pgs.map((pg) => {
    pg._k = 0;
    pg.querySelectorAll('.fx,.pop').forEach((n, i) => n.style.setProperty('--i', i));
    const L = pg.id === 'mempelai' ? [] : [...pg.querySelectorAll('*')].filter((n) => !n.children.length && n.textContent.trim() && !n.matches(SKIP));
    L.forEach((n) => {
      n._t = n.textContent; n._a = document.createTextNode(''); n._b = el('span', 'tb', n._t); n.replaceChildren(n._a, n._b);
      if (RM) setK(n, n._t.length);
    });
    return { pg, L };
  });
  const menuItems = new Map();
  const enter = ({ pg, L }) => {
    const m = menuItems.get(pg.id); if (m) { menuItems.forEach((b) => b.classList.remove('cur')); m.classList.add('cur'); }
    if (pg.classList.contains('in')) return;
    pg.classList.add('in'); const k = ++pg._k; clearTimeout(pg._d); pg._d = setTimeout(() => pg.classList.add('done'), 2000);
    if (RM) return;
    let t = 450;
    const it = L.map((n) => { const d = Math.min(850, Math.max(160, n._t.length * 14)), o = { n, s: t, d }; t += d * 0.6; return o; });
    const sc = t > 2800 ? 2800 / t : 1; it.forEach((o) => { o.s *= sc; o.d *= sc; });
    const t0 = performance.now();
    const f = (now) => {
      if (pg._k !== k) return;
      let more = false;
      it.forEach((o) => { const p = Math.min(1, Math.max(0, (now - t0 - o.s) / o.d)), c = Math.round(o.n._t.length * p); if (c !== o.c) { o.c = c; setK(o.n, c); } if (p < 1) more = true; });
      if (more) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  };
  const leave = ({ pg, L }) => {
    if (!pg.classList.contains('in')) return;
    pg._k++; clearTimeout(pg._d); pg.classList.remove('in', 'done');
    if (!RM) L.forEach((n) => setK(n, 0));
  };
  if (!RM) stage.forEach(({ L }) => L.forEach((n) => setK(n, 0)));
  const map = new Map(stage.map((s) => [s.pg, s]));
  const pio = new IntersectionObserver((es) => es.forEach((e) => {
    const s = map.get(e.target);
    if (e.intersectionRatio >= 0.3) enter(s); else if (e.intersectionRatio < 0.08) leave(s);
  }), { threshold: [0, 0.08, 0.3] });
  pgs.forEach((p) => pio.observe(p));

  /* Bagikan: WhatsApp dan salin tautan (tanpa nama tamu; hadiah=0 ikut terbawa) */
  const shareUrl = C.site.url.replace(/\/?$/, '/') + ($('#hadiah') ? '' : '?hadiah=0');
  const shareWA = () => {
    const { bride: b, groom: g } = C.couple, nm = (p) => p.full.split(',')[0];
    const isi = $('#hadiah')
      ? `Kami mengundang Anda di pernikahan ${b.short} & ${g.short}`
      : `Kami ${b.parents} bersama ${g.parents} mengundang Anda di pernikahan anak kami ${nm(b)} & ${nm(g)}`;
    const t = `Assalamu'alaikum Wr. Wb.\n\n${isi}\n${C.date.label}\n\nBuka undangan:\n${shareUrl}`;
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
  };
  const shareCopy = () => copy(shareUrl, 'Tautan undangan disalin');
  $('#shWa').addEventListener('click', shareWA); $('#shCopy').addEventListener('click', shareCopy);

  /* Menu halaman (dari section ber-data-menu; Hadiah Digital otomatis hilang bila hadiah=0) */
  const ml = $('#menuList'), mbtn = $('#menuBtn'); let mon = false;
  pgs.filter((p) => p.dataset.menu).forEach((pg, i) => {
    const li = el('li'), b = el('button', '', pg.dataset.menu); b.type = 'button'; b.dataset.to = pg.id; li.style.setProperty('--n', i); li.append(b); ml.append(li); menuItems.set(pg.id, b);
  });
  const acts = el('li', 'macts'); acts.style.setProperty('--n', menuItems.size);
  [['wa', 'Share WhatsApp'], ['copy', 'Copy Link']].forEach(([a, t]) => { const b = el('button', '', t); b.type = 'button'; b.dataset.act = a; acts.append(b); });
  ml.append(acts);
  const mOpen = () => { if (mon) return; mon = true; root.classList.add('menu-on'); mbtn.setAttribute('aria-expanded', 'true'); history.pushState({ mn: 1 }, ''); };
  const mShut = () => { mon = false; root.classList.remove('menu-on'); mbtn.setAttribute('aria-expanded', 'false'); };
  const mClose = () => { if (!mon) return; if (history.state && history.state.mn) history.back(); else mShut(); };
  mbtn.addEventListener('click', () => (mon ? mClose() : mOpen()));
  $('#veil').addEventListener('click', mClose);
  ml.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.act) { (b.dataset.act === 'wa' ? shareWA : shareCopy)(); mClose(); return; }
    mClose(); setTimeout(() => document.getElementById(b.dataset.to).scrollIntoView({ behavior: 'smooth' }), 80);
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') mClose(); });

  /* Ucapan: dibaca dari dan dikirim ke Google Sheets (rsvpEndpoint) */
  let wishes = C.rsvpEndpoint ? [] : [...C.sampleWishes];
  const render = (anim) => {
    const ul = $('#wishList'); ul.innerHTML = '';
    wishes.forEach((w, i) => {
      const li = el('li', anim && i === 0 ? 'wi' : ''), t = el('div', 'wt'), ok = w.status === 'Hadir';
      t.append(el('strong', '', w.name), el('span', 'st' + (ok ? '' : ' n'), ok ? 'Hadir · ' + (+w.guests || 1) + ' orang' : 'Tidak Hadir'));
      li.append(t, el('p', '', w.text), el('small', '', w.time)); ul.append(li);
    });
    const tamu = wishes.reduce((s, w) => s + (w.status === 'Hadir' ? +w.guests || 1 : 0), 0);
    $('#wishCount').textContent = wishes.length + ' ucapan • ' + tamu + ' tamu hadir';
  };
  const load = async () => {
    if (!C.rsvpEndpoint) return;
    try {
      const r = await fetch(C.rsvpEndpoint + (C.rsvpEndpoint.includes('?') ? '&' : '?') + 't=' + Date.now()), d = await r.json();
      if (Array.isArray(d)) { const ul = $('#wishList'), st = ul.scrollTop; wishes = d; render(); ul.scrollTop = st; }
    } catch (e) { /* biarkan apa adanya */ }
  };
  render(); load();

  /* Jumlah tamu (disembunyikan bila Tidak Hadir) */
  let guests = 1; const gRow = $('#gRow');
  const setG = (n) => { guests = Math.min(100, Math.max(1, Math.round(+n) || 1)); $('#gNum').value = guests; };
  $('#gMinus').addEventListener('click', () => setG(guests - 1));
  $('#gPlus').addEventListener('click', () => setG(guests + 1)); $('#gNum').addEventListener('change', () => setG($('#gNum').value));
  $$('input[name="hadir"]').forEach((r) => r.addEventListener('change', () => gRow.classList.toggle('hidden', $('input[name="hadir"]:checked').value !== 'Hadir')));

  $('#nama').addEventListener('input', (e) => (e.target.dataset.auto = '0'));
  $('#rsvpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#nama').value.trim(), text = $('#ucapan').value.trim(), err = $('#formErr');
    const status = $('input[name="hadir"]:checked').value;
    if (!name || !text) { err.textContent = 'Isi nama dan ucapan terlebih dahulu.'; err.classList.remove('hidden'); return; }
    err.classList.add('hidden');
    const time = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'});
    setG($('#gNum').value); const entry = { name, status, guests: status === 'Hadir' ? guests : 0, text, time };
    wishes.unshift(entry); render(true);
    if (C.rsvpEndpoint) fetch(C.rsvpEndpoint, { method: 'POST', mode: 'no-cors', body: JSON.stringify(entry) }).catch(() => {});
    const b = e.target.querySelector('button[type="submit"]'); b.disabled = true; setTimeout(() => (b.disabled = false), 10000);
    e.target.reset(); setG(1); gRow.classList.remove('hidden'); $('#wishList').scrollTop = 0; toast('Terima kasih! Konfirmasi Anda terkirim');
  });

  /* Kolom ucapan: halaman bergulir biasa sampai diketuk; lalu scroll di dalam kolom (tombol ×/kembali untuk keluar) */
  const box = $('#wishBox'); let on = false;
  const open = () => { if (on) return; on = true; box.classList.add('on'); history.pushState({ wb: 1 }, ''); load(); };
  const shut = () => { on = false; box.classList.remove('on'); };
  const close = () => { if (!on) return; if (history.state && history.state.wb) history.back(); else shut(); };
  box.addEventListener('click', (e) => (e.target.closest('#wishClose') ? close() : open()));
  box.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !on) open(); else if (e.key === 'Escape') close(); });
  addEventListener('popstate', () => {
    const s = history.state || {};
    if (on && !s.wb) shut();
    if (mon && !s.mn) mShut();
  });

  /* Jeda animasi hiasan saat menggulir agar scroll halus */
  let st;
  addEventListener('scroll', () => { root.classList.add('scrolling'); clearTimeout(st); st = setTimeout(() => root.classList.remove('scrolling'), 160); }, { passive: true });

  /* Buka undangan */
  $('#openBtn').addEventListener('click', () => {
    playMusic(); root.classList.remove('locked'); cover.classList.add('out'); scrollTo(0, 0);
  });
})();
