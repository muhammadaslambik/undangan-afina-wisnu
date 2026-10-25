(() => {
  'use strict';
  const C = window.INVITATION, $ = (s) => document.querySelector(s), root = document.documentElement;
  const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const el = (t, c = '', x = '') => { const n = document.createElement(t); if (c) n.className = c; if (x) n.textContent = x; return n; };

  /* Kunci halaman sampai tombol "Buka Undangan" ditekan */
  root.classList.add('locked');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  let tt;
  const toast = (m) => { const t = $('#toast'); t.textContent = m; t.style.opacity = 1; clearTimeout(tt); tt = setTimeout(() => (t.style.opacity = 0), 2200); };
  const copy = async (text, msg) => { try { await navigator.clipboard.writeText(text); toast(msg); } catch (e) { toast('Salin manual: ' + text); } };

  /* Teks dari config */
  document.title = C.site.title;
  document.querySelectorAll('[data-bind]').forEach((n) => { const v = get(C, n.dataset.bind); if (v != null) n.textContent = v; });
  $('#heroTime').textContent = C.events.map((e) => e.title + ' ' + e.time).join('  •  ');
  $('#marq').append(...[...Array(8)].map(() => el('span', '', 'Save the date  •  ' + C.date.label)));

  /* Mempelai */
  C.couple && [C.couple.bride, C.couple.groom].forEach((p, i) => {
    const c = el('div', 'pc glass reveal'), a = el('div', 'arch'), img = el('img');
    img.src = p.photo; img.alt = 'Foto ' + p.full; img.loading = 'lazy'; a.append(img);
    const pr = el('p'); pr.append(p.role + ' ', document.createElement('br'), p.parents);
    c.append(a, el('h3', '', p.full), pr); c.style.transitionDelay = i * 0.15 + 's';
    $('#coupleGrid').append(c);
  });

  /* Acara */
  C.events.forEach((ev, i) => {
    const c = el('article', 'ev glass reveal'), top = el('div', 'top'), ico = el('div', 'ico' + (i ? ' g' : ''), i ? '✿' : '◐');
    top.append(ico, el('span', 'tag', ev.title));
    const ul = el('ul');
    [['◷', ev.time], ['◎', ev.place], ['⌖', ev.address]].forEach(([k, v]) => { const li = el('li'); li.append(el('span', '', k), el('span', '', v)); ul.append(li); });
    c.append(top, el('h3', '', ev.title), el('p', 'd', C.date.label), ul);
    $('#eventsGrid').append(c);
  });
  $('#mapBtn').href = C.events[0].mapUrl;
  $('#copyAddr').addEventListener('click', () => copy(C.events[0].address, 'Alamat disalin'));

  /* Amplop digital (disembunyikan lewat /hadiah=0 atau ?hadiah=0) */
  if (location.pathname.includes('hadiah=0') || new URLSearchParams(location.search).get('hadiah') === '0') $('#giftSec').remove();
  else C.gifts.forEach((g) => {
    const c = el('div', 'gift glass reveal');
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
  const bgm = $('#bgm'), cover = $('#cover'); let started = false, resume = false;
  $('#musicBtn').title = C.musicTitle || 'Musik';
  bgm.preload = 'auto'; bgm.volume = 0.7; bgm.src = C.music;
  const icon = (on) => { $('#icPlay').classList.toggle('hidden', on); $('#icPause').classList.toggle('hidden', !on); };
  bgm.addEventListener('play', () => { started = true; icon(true); cover.classList.remove('music-off'); });
  bgm.addEventListener('pause', () => { icon(false); if (started) cover.classList.add('music-off'); });
  const playMusic = async () => { try { await bgm.play(); } catch (e) { toast('Musik belum bisa diputar. Ketuk tombol musik.'); } };
  $('#musicBtn').addEventListener('click', () => (bgm.paused ? playMusic() : bgm.pause()));
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

  /* Animasi muncul saat scroll */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((n) => io.observe(n));

  /* Ucapan: dibaca dari dan dikirim ke Google Sheets (rsvpEndpoint) */
  let wishes = C.rsvpEndpoint ? [] : [...C.sampleWishes];
  const render = (anim) => {
    const ul = $('#wishList'); ul.innerHTML = '';
    wishes.forEach((w, i) => {
      const li = el('li', anim && i === 0 ? 'wi' : ''), t = el('div', 'wt');
      t.append(el('strong', '', w.name), el('span', 'st' + (w.status === 'Hadir' ? '' : ' n'), w.status));
      li.append(t, el('p', '', w.text), el('small', '', w.time)); ul.append(li);
    });
    $('#wishCount').textContent = wishes.length + ' ucapan';
  };
  const load = async () => {
    if (!C.rsvpEndpoint) return;
    try {
      const r = await fetch(C.rsvpEndpoint + (C.rsvpEndpoint.includes('?') ? '&' : '?') + 't=' + Date.now()), d = await r.json();
      if (Array.isArray(d)) { const ul = $('#wishList'), st = ul.scrollTop; wishes = d; render(); ul.scrollTop = st; }
    } catch (e) { /* biarkan apa adanya */ }
  };
  render(); load();
  $('#nama').addEventListener('input', (e) => (e.target.dataset.auto = '0'));
  $('#rsvpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#nama').value.trim(), text = $('#ucapan').value.trim(), err = $('#formErr');
    const status = document.querySelector('input[name="hadir"]:checked').value;
    if (!name || !text) { err.textContent = 'Isi nama dan ucapan terlebih dahulu.'; err.classList.remove('hidden'); return; }
    err.classList.add('hidden');
    const time = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), entry = { name, status, text, time };
    wishes.unshift(entry); render(true);
    if (C.rsvpEndpoint) fetch(C.rsvpEndpoint, { method: 'POST', mode: 'no-cors', body: JSON.stringify(entry) }).catch(() => {});
    const b = e.target.querySelector('button[type="submit"]'); b.disabled = true; setTimeout(() => (b.disabled = false), 10000);
    e.target.reset(); $('#wishList').scrollTop = 0; toast('Terima kasih! Konfirmasi Anda terkirim');
  });

  /* Kolom ucapan: halaman bergulir biasa sampai diketuk; lalu scroll di dalam kolom (tombol ×/kembali untuk keluar) */
  const box = $('#wishBox'); let on = false;
  const open = () => { if (on) return; on = true; box.classList.add('on'); history.pushState({ wb: 1 }, ''); load(); };
  const shut = () => { on = false; box.classList.remove('on'); };
  const close = () => { if (!on) return; if (history.state && history.state.wb) history.back(); else shut(); };
  box.addEventListener('click', (e) => (e.target.closest('#wishClose') ? close() : open()));
  box.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !on) open(); else if (e.key === 'Escape') close(); });
  addEventListener('popstate', () => { if (on) shut(); });

  /* Buka undangan */
  $('#openBtn').addEventListener('click', () => {
    playMusic(); root.classList.remove('locked'); cover.classList.add('out'); scrollTo(0, 0);
  });
})();
